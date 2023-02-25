package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"golang-backend/base"
	"golang-backend/configs"
	"golang-backend/models"
	"golang-backend/responses"
	"time"

	"github.com/onflow/cadence"
	"github.com/onflow/flow-go-sdk/access"
	"github.com/onflow/flow-go-sdk/crypto"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/onflow/flow-go-sdk"

	HTTPP "github.com/onflow/flow-go-sdk/access/http"
)

var submissionCollection *mongo.Collection = configs.GetCollection(configs.DB, "submission")

// take parameter of userID and challengeID
func CreateSubmission(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var submission models.Submission
	defer cancel()

	err := json.Unmarshal(c.Body(), &submission)
	if err != nil {
		return err
	}

	challengeID, err := primitive.ObjectIDFromHex(submission.ChallengeID.Hex())
	if err != nil {
		return err
	}
	userID, err := primitive.ObjectIDFromHex(submission.UserID.Hex())
	if err != nil {
		return err
	}

	objectID := primitive.NewObjectID()

	//get the id from metadata from stripe webhook
	newSubmission := models.Submission{
		ID:          objectID,
		VideoLink:   submission.VideoLink,
		ChallengeID: challengeID,
		UserID:      userID,
	}

	//inser to DB for visilibity
	result, err := submissionCollection.InsertOne(ctx, newSubmission)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	fmt.Println(result)

	//get string of submission ID
	submissionID := objectID.Hex()

	//find one user from userCollection with userID
	userCollection := configs.GetCollection(configs.DB, "users")
	userFilter := bson.M{"_id": userID}
	userCursor, err := userCollection.Find(ctx, userFilter)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	//print userCursor in readable format
	var user models.User
	for userCursor.Next(ctx) {
		err := userCursor.Decode(&user)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
		}
	}

	//create a transaction to send to flow
	flowClient, err := HTTPP.NewClient(HTTPP.TestnetHost)
	base.Handle(err)

	// serviceAcctAddr, serviceAcctKey, serviceSigner := ServiceAccount(flowClient, "983e58ec210fe715c3c90d18ddae1323de6cbd8e5348fca4b167ed2cf6cd1ddc", "1848726466b5f84e")

	serviceAcctAddr, serviceAcctKey, serviceSigner := ServiceAccount(flowClient, user.PrivateKey, user.Address)

	transaction := flow.NewTransaction().
		SetScript([]byte(`
		import FungibleToken from 0x9a0766d93b6608b7
		import FiatToken from 0xa983fecbed621163
		import StakingV7 from 0xf3ecf4159841b043
		
		transaction(submissionId: String) {
		
		
			prepare(signer: AuthAccount) {
				StakingV7.depositStake(signer, submissionId: submissionId)
		
				 log("token deposited")
			}
		
		}

	`))

	referenceBlockID := base.GetReferenceBlockId(flowClient)

	transaction.SetProposalKey(
		serviceAcctAddr,
		serviceAcctKey.Index,
		serviceAcctKey.SequenceNumber,
	)
	transaction.SetReferenceBlockID(referenceBlockID)
	transaction.SetPayer(serviceAcctAddr)
	transaction.AddAuthorizer(serviceAcctAddr)

	// Add the arguments to the transaction
	transaction.AddArgument(cadence.String(submissionID))

	// Sign the transaction with the service account, which already exists
	// All new accounts must be created by an existing account
	err = transaction.SignEnvelope(serviceAcctAddr, serviceAcctKey.Index, serviceSigner)
	base.Handle(err)

	// Send the transaction to the network
	err = flowClient.SendTransaction(ctx, *transaction)
	base.Handle(err)

	fmt.Println("ID", transaction.ID())

	// get latest block height
	latestBlock, err := flowClient.GetLatestBlock(ctx, true)

	//print the latest block height
	fmt.Println("Latest block height:", latestBlock.Height)

	time.Sleep(7 * time.Second)

	transactionRes := base.WaitForSeal(ctx, flowClient, transaction.ID())

	fmt.Println("Transaction status:", transactionRes.Status)

	//convert transactionID to string
	transactionID := transaction.ID().String()

	return c.Status(http.StatusCreated).JSON(responses.UserResponse{Status: http.StatusCreated, Message: "success", Data: &fiber.Map{"data": "https://testnet.flowscan.org/transaction/" + transactionID}})
}

func ServiceAccount(flowClient access.Client, key string, address string) (flow.Address, *flow.AccountKey, crypto.Signer) {
	privateKey, err := crypto.DecodePrivateKeyHex(crypto.ECDSA_P256, key)
	base.Handle(err)

	addr := flow.HexToAddress(address)
	acc, err := flowClient.GetAccount(context.Background(), addr)
	base.Handle(err)

	accountKey := acc.Keys[0]
	signer, err := crypto.NewInMemorySigner(privateKey, accountKey.HashAlgo)
	base.Handle(err)
	return addr, accountKey, signer
}

func GetAllSubmission(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	//get query of challengeID
	challengeID := c.Query("challengeId")

	fmt.Println(challengeID)

	var submissions []models.Submission

	//convert challengeId to hex
	challengeIDNew, err := primitive.ObjectIDFromHex(challengeID)

	//find all submission that matches challengeID
	cursor, err := submissionCollection.Find(ctx, bson.M{"challengeID": challengeIDNew})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	//loop through all the submission and append to the array
	for cursor.Next(ctx) {
		var submission models.Submission
		cursor.Decode(&submission)
		submissions = append(submissions, submission)
	}

	//return all the submission
	return c.Status(http.StatusOK).JSON(responses.UserResponse{Status: http.StatusOK, Message: "success", Data: &fiber.Map{"data": submissions}})
}

// get submission that hasn't been verified
func GetSubmissionNotVerify(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	//get query of challengeID
	challengeID := c.Query("challengeId")

	fmt.Println(challengeID)

	var submissions []models.Submission

	//convert challengeId to hex
	challengeIDNew, err := primitive.ObjectIDFromHex(challengeID)

	//find all submission that matches challengeID
	cursor, err := submissionCollection.Find(ctx, bson.M{"challengeID": challengeIDNew, "isVerified": false})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	//loop through all the submission and append to the array
	for cursor.Next(ctx) {
		var submission models.Submission
		cursor.Decode(&submission)
		submissions = append(submissions, submission)
	}

	//return all the submission
	return c.Status(http.StatusOK).JSON(responses.UserResponse{Status: http.StatusOK, Message: "success", Data: &fiber.Map{"data": submissions}})
}

func VerfiySubmission(c *fiber.Ctx) error {

	ctx := context.Background()
	id := c.Query("submissionId")

	//find the submission by id and change isVerified to true
	filter := bson.M{"_id": id}
	update := bson.M{"$set": bson.M{"isVerified": true}}
	_, err := submissionCollection.UpdateOne(ctx, filter, update)

	flowClient, err := HTTPP.NewClient(HTTPP.TestnetHost)
	base.Handle(err)

	serviceAcctAddr, serviceAcctKey, serviceSigner := base.ServiceAccount(flowClient)

	transaction := flow.NewTransaction().
		SetScript([]byte(`
		import FungibleToken from 0x9a0766d93b6608b7
		import FiatToken from 0xa983fecbed621163
		import StakingV7 from 0xf3ecf4159841b043


		//approve the submission of the staker so they qualify to reward
		transaction(submissionId: String) {

			prepare(admin: AuthAccount) {

				let adminRef = admin.borrow<&StakingV7.Administrator>(from: /storage/StakingAdministrator)!

				adminRef.qualifyStaker(submissionId)

			}

		}

	`))

	referenceBlockID := base.GetReferenceBlockId(flowClient)

	transaction.SetProposalKey(
		serviceAcctAddr,
		serviceAcctKey.Index,
		serviceAcctKey.SequenceNumber,
	)
	transaction.SetReferenceBlockID(referenceBlockID)
	transaction.SetPayer(serviceAcctAddr)
	transaction.AddAuthorizer(serviceAcctAddr)
	transaction.AddArgument(cadence.String(id))

	// Sign the transaction with the service account, which already exists
	// All new accounts must be created by an existing account
	err = transaction.SignEnvelope(serviceAcctAddr, serviceAcctKey.Index, serviceSigner)
	base.Handle(err)

	// Send the transaction to the network
	err = flowClient.SendTransaction(ctx, *transaction)
	base.Handle(err)

	fmt.Println("ID", transaction.ID())

	// get latest block height
	latestBlock, err := flowClient.GetLatestBlock(ctx, true)

	//print the latest block height
	fmt.Println("Latest block height:", latestBlock.Height)

	time.Sleep(7 * time.Second)

	transactionRes := base.WaitForSeal(ctx, flowClient, transaction.ID())

	fmt.Println("Transaction status:", transactionRes.Status)

	return c.Status(http.StatusCreated).JSON(responses.SimpleResponse{Status: http.StatusOK})

}
