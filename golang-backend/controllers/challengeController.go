package controllers

import (
	"context"
	"encoding/json"
	"fmt"

	"golang-backend/base"

	"golang-backend/configs"
	"golang-backend/models"
	"golang-backend/responses"
	"net/http"
	"time"

	"github.com/onflow/flow-go-sdk"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	HTTPP "github.com/onflow/flow-go-sdk/access/http"
)

var challengeCollection *mongo.Collection = configs.GetCollection(configs.DB, "challenges")

func CreateChallenge(c *fiber.Ctx) error {
	var validate = validator.New()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	var challenge models.Challenge
	defer cancel()

	//validate the request body
	if err := c.BodyParser(&challenge); err != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.UserResponse{Status: http.StatusBadRequest, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	//use the validator library to validate required fields
	if validationErr := validate.Struct(&challenge); validationErr != nil {
		return c.Status(http.StatusBadRequest).JSON(responses.UserResponse{Status: http.StatusBadRequest, Message: "error", Data: &fiber.Map{"data": validationErr.Error()}})
	}

	objectID := primitive.NewObjectID()

	newChallenge := models.Challenge{
		ID:            objectID,
		VideoLink:     challenge.VideoLink,
		Ended:         false,
		Name:          challenge.Name,
		ChallengeType: challenge.ChallengeType,
		Link:          challenge.Link,
		Description:   challenge.Description,
		Image:         challenge.Image,
	}

	result, err := challengeCollection.InsertOne(ctx, newChallenge)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})

	}

	return c.Status(http.StatusCreated).JSON(responses.UserResponse{Status: http.StatusCreated, Message: "success", Data: &fiber.Map{"data": result}})
}

func GetAllChallenges(c *fiber.Ctx) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// var challenge models.Challenge
	var challenges []models.Challenge

	cursor, err := challengeCollection.Find(ctx, bson.D{})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	for cursor.Next(ctx) {
		var challenge models.Challenge
		if err := cursor.Decode(&challenge); err != nil {
			// Handle error
		}
		fmt.Println(challenge)
		challenges = append(challenges, challenge)
	}
	if err := cursor.Err(); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	jsonChallenges, err := json.Marshal(challenges)
	if err != nil {
		// Handle error
	}

	// Set the response status code and write the JSON-encoded challenges to the response
	data := &fiber.Map{
		"data": json.RawMessage(jsonChallenges),
	}

	return c.Status(http.StatusOK).JSON(responses.UserResponse{
		Status:  http.StatusOK,
		Message: "success",
		Data:    data,
	})

}

func EndChallenge(c *fiber.Ctx) error {

	ctx := context.Background()

	flowClient, err := HTTPP.NewClient(HTTPP.TestnetHost)
	base.Handle(err)

	serviceAcctAddr, serviceAcctKey, serviceSigner := base.ServiceAccount(flowClient)

	transaction := flow.NewTransaction().
		SetScript([]byte(`
		import FungibleToken from 0x9a0766d93b6608b7
		import FiatToken from 0xa983fecbed621163
		import StakingV8 from 0xf3ecf4159841b043
		
		
		//distribute the stake once the challenge ends
		//only can be called by the admin
		transaction() {
		
		
			prepare(admin: AuthAccount) {
				let adminRef = admin.borrow<&StakingV8.Administrator>(from: /storage/StakingAdministratorV8)!
		
		
				adminRef.distributeStake()
		
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
