package controllers

import (
	"context"
	"fmt"
	"net/http"

	"golang-backend/base"
	"golang-backend/configs"
	"golang-backend/models"
	"golang-backend/responses"
	"time"

	"github.com/onflow/cadence"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/onflow/flow-go-sdk"

	HTTPP "github.com/onflow/flow-go-sdk/access/http"
)

var submissionCollection *mongo.Collection = configs.GetCollection(configs.DB, "submission")

// take parameter of userID and challengeID
func CreateSubmission(userID primitive.ObjectID, challengeID primitive.ObjectID, videoLink string) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var submission models.Submission
	defer cancel()

	objectID := primitive.NewObjectID()

	newSubmission := models.Submission{
		ID:          objectID,
		VideoLink:   submission.VideoLink,
		ChallengeID: challengeID,
		UserID:      userID,
	}

	result, err := challengeCollection.InsertOne(ctx, newSubmission)
	if err != nil {
		// return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	fmt.Println(result)

	// return c.Status(http.StatusCreated).JSON(responses.UserResponse{Status: http.StatusCreated, Message: "success", Data: &fiber.Map{"data": result}})
}

func VerfiySubmission(c *fiber.Ctx) error {

	ctx := context.Background()
	id := c.Query("submissionId")

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
