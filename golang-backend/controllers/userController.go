package controllers

import (
	"context"
	"fmt"
	"sync"

	"golang-backend/base"

	"golang-backend/configs"
	"golang-backend/models"
	"golang-backend/responses"
	httpp "net/http"

	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/onflow/cadence"
	"github.com/onflow/flow-go-sdk/access/http"
	"github.com/onflow/flow-go-sdk/crypto"

	"github.com/onflow/flow-go-sdk/templates"

	"go.mongodb.org/mongo-driver/bson"

	"github.com/onflow/flow-go-sdk"

	"github.com/magiclabs/magic-admin-go"
	magicClient "github.com/magiclabs/magic-admin-go/client"

	HTTP "github.com/onflow/flow-go-sdk/access/http"
)

var userCollection *mongo.Collection = configs.GetCollection(configs.DB, "users")
var validate = validator.New()

type httpHandlerFunc func(httpp.ResponseWriter, *httpp.Request)
type key string

const userInfoKey key = "userInfo"
const authBearer = "Bearer"

var magicSDK = magicClient.New("sk_live_E0AB0A0BECCA2010", magic.NewDefaultClient())

func CreateUser(c *fiber.Ctx) error {
	var wg sync.WaitGroup

	// m := magicClient.New("sk_live_E0AB0A0BECCA2010", magic.NewDefaultClient())
	// userInfo, err := m.User.GetMetadataByToken("<DID_TOKEN>")

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	var user models.User
	defer cancel()

	//validate the request body
	if err := c.BodyParser(&user); err != nil {
		return c.Status(httpp.StatusBadRequest).JSON(responses.UserResponse{Status: httpp.StatusBadRequest, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	// //use the validator library to validate required fields
	// if validationErr := validate.Struct(&user); validationErr != nil {
	// 	return c.Status(httpp.StatusBadRequest).JSON(responses.UserResponse{Status: httpp.StatusBadRequest, Message: "error", Data: &fiber.Map{"data": validationErr.Error()}})
	// }

	var address string
	var key string

	// Add a counter to the WaitGroup.
	wg.Add(1)
	go func() {
		defer wg.Done()

		// Call your function here.
		address, key = CreateAccount()
	}()

	// Wait for the function to finish.
	wg.Wait()

	fmt.Println("Address:", address, "key:", key)

	objectID := primitive.NewObjectID()

	newUser := models.User{
		ID:         objectID,
		Address:    address,
		PrivateKey: key[2:],
		Email:      user.Email}

	result, err := userCollection.InsertOne(ctx, newUser)

	insertedID := result.InsertedID

	// Retrieve the inserted document from the collection using its ID
	var insertedDoc models.User
	err = userCollection.FindOne(ctx, bson.M{"_id": insertedID}).Decode(&insertedDoc)
	if err != nil {
		panic(err)
	}

	if err != nil {
		return c.Status(httpp.StatusInternalServerError).JSON(responses.UserResponse{Status: httpp.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	return c.Status(httpp.StatusCreated).JSON(responses.UserResponse{Status: httpp.StatusCreated, Message: "success", Data: &fiber.Map{"data": insertedDoc}})
}

func CreateAccount() (string, string) {

	ctx := context.Background()
	flowClient, err := http.NewClient(http.TestnetHost)
	base.Handle(err)

	fmt.Println("Flow client:, ctx:", ctx, flowClient)

	serviceAcctAddr, serviceAcctKey, serviceSigner := base.ServiceAccount(flowClient)

	fmt.Println("Service account address:", serviceAcctAddr, "key:", serviceAcctKey, "signer:", serviceSigner)

	myPrivateKey := base.RandomPrivateKey()

	//print the private key
	fmt.Println("Private key:", myPrivateKey)
	myAcctKey := flow.NewAccountKey().
		FromPrivateKey(myPrivateKey).
		SetHashAlgo(crypto.SHA3_256).
		SetWeight(flow.AccountKeyWeightThreshold)

	referenceBlockID := base.GetReferenceBlockId(flowClient)

	createAccountTx, err := templates.CreateAccount([]*flow.AccountKey{myAcctKey}, nil, serviceAcctAddr)
	base.Handle(err)
	createAccountTx.SetProposalKey(
		serviceAcctAddr,
		serviceAcctKey.Index,
		serviceAcctKey.SequenceNumber,
	)
	createAccountTx.SetReferenceBlockID(referenceBlockID)
	createAccountTx.SetPayer(serviceAcctAddr)

	// Sign the transaction with the service account, which already exists
	// All new accounts must be created by an existing account
	err = createAccountTx.SignEnvelope(serviceAcctAddr, serviceAcctKey.Index, serviceSigner)
	base.Handle(err)

	// Send the transaction to the network
	err = flowClient.SendTransaction(ctx, *createAccountTx)
	base.Handle(err)

	fmt.Println("ID", createAccountTx.ID())

	// get latest block height
	// latestBlock, err := flowClient.GetLatestBlock(ctx, true)

	// //print the latest block height
	// fmt.Println("Latest block height:", latestBlock.Height)

	time.Sleep(10 * time.Second)

	accountCreationTxRes := base.WaitForSeal(ctx, flowClient, createAccountTx.ID())

	var myAddress flow.Address

	for _, event := range accountCreationTxRes.Events {
		if event.Type == flow.EventAccountCreated {
			accountCreatedEvent := flow.AccountCreatedEvent(event)
			myAddress = accountCreatedEvent.Address()
		}
	}

	// var address string = myAddress.Hex()

	// setupVault(address)

	// var address string = myAddress.Hex()

	// //send flow and create vault
	// afterTx := func(address string) {
	// 	transferFlow(address)

	// 	setupVault(address)
	// }

	// defer afterTx(address)

	return myAddress.Hex(), myPrivateKey.String()

	// fmt.Println("Account created with address:", myAddress.Hex())

}

func GetUserBalance(c *fiber.Ctx) error {
	// Connect to the Flow testnet
	ctx := context.Background()
	flowClient, err := HTTP.NewClient(HTTP.TestnetHost)
	base.Handle(err)

	address := c.Query("address")

	fmt.Println(address)

	script := []byte(`
	import FungibleToken from 0x9a0766d93b6608b7
	import FiatToken from 0xa983fecbed621163

	pub fun main(address: Address): UFix64 {
		let account = getAccount(address)
			.getCapability<&FiatToken.Vault{FungibleToken.Balance}>(
			   FiatToken.VaultBalancePubPath
			)
			.borrow()
			?? panic("Could not borrow Vault reference")

		return account.balance
	}

	`)

	addr := flow.HexToAddress(address)

	//add arguments to the script
	// args := [][]byte{
	// 		address
	// }

	args := []cadence.Value{
		cadence.Address(addr),
	}

	//execute the script

	balanceRes, err := flowClient.ExecuteScriptAtLatestBlock(ctx, script, args)
	if err != nil {
		return c.Status(httpp.StatusInternalServerError).JSON(responses.UserResponse{Status: httpp.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	}

	fmt.Println("Transaction status:", balanceRes)

	return c.Status(httpp.StatusCreated).JSON(responses.UserResponse{Status: httpp.StatusCreated, Message: "success", Data: &fiber.Map{"data": balanceRes}})

}

// func transferFlow(address string) {
// 	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
// 	defer cancel()

// 	// amount := 20.00000000

// 	//initialize fiatToken vault to the account
// 	//create a transaction to send to flow
// 	flowClient, err := HTTP.NewClient(HTTP.TestnetHost)
// 	base.Handle(err)

// 	serviceAcctAddr, serviceAcctKey, serviceSigner := base.ServiceAccount(flowClient)

// 	//create new vault for fiat token
// 	transaction := flow.NewTransaction().
// 		SetScript([]byte(`
// 		import FungibleToken from 0x9a0766d93b6608b7

// 		transaction(to: Address) {
// 			let vault: @FungibleToken.Vault
// 			prepare(signer: AuthAccount) {
// 			self.vault <- signer
// 			.borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!
// 			.withdraw(amount: 20.00000000)
// 			}
// 			execute {
// 			getAccount(to)
// 			.getCapability(/public/flowTokenReceiver)!
// 			.borrow<&{FungibleToken.Receiver}>()!
// 			.deposit(from: <-self.vault)
// 			}
// 		}

// 	`))

// 	referenceBlockID := base.GetReferenceBlockId(flowClient)

// 	transaction.SetProposalKey(
// 		serviceAcctAddr,
// 		serviceAcctKey.Index,
// 		serviceAcctKey.SequenceNumber,
// 	)
// 	transaction.SetReferenceBlockID(referenceBlockID)
// 	transaction.SetPayer(serviceAcctAddr)
// 	transaction.AddAuthorizer(serviceAcctAddr)
// 	//add argument to transaction that convert amount to cadence
// 	// transaction.AddArgument(cadence.UFix64(amount))
// 	transaction.AddArgument(cadence.NewAddress(flow.HexToAddress(address)))

// 	//add argument to transaction that convert amount to cadence

// 	// Sign the transaction with the service account, which already exists
// 	// All new accounts must be created by an existing account
// 	err = transaction.SignEnvelope(serviceAcctAddr, serviceAcctKey.Index, serviceSigner)
// 	base.Handle(err)

// 	// Send the transaction to the network
// 	err = flowClient.SendTransaction(ctx, *transaction)
// 	base.Handle(err)

// 	fmt.Println("ID", transaction.ID())

// 	// get latest block height
// 	latestBlock, err := flowClient.GetLatestBlock(ctx, true)

// 	//print the latest block height
// 	fmt.Println("Latest block height:", latestBlock.Height)

// 	time.Sleep(7 * time.Second)

// 	transactionRes := base.WaitForSeal(ctx, flowClient, transaction.ID())
// 	base.Handle(err)

// 	fmt.Println("Transaction status:", transactionRes.Status)
// }

// // run flow transaction script to set up fiattoken vault
// func setupVault(address string) {
// 	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
// 	defer cancel()

// 	//initialize fiatToken vault to the account
// 	//create a transaction to send to flow
// 	flowClient, err := HTTP.NewClient(HTTP.TestnetHost)
// 	base.Handle(err)

// 	userCollection := configs.GetCollection(configs.DB, "users")
// 	userFilter := bson.M{"address": address}
// 	userCursor, err := userCollection.Find(ctx, userFilter)
// 	// if err != nil {
// 	// 	return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
// 	// }

// 	var user models.User
// 	for userCursor.Next(ctx) {
// 		err := userCursor.Decode(&user)
// 		if err != nil {
// 			// return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
// 		}
// 	}

// 	// serviceAcctAddr, serviceAcctKey, serviceSigner := ServiceAccount(flowClient, "983e58ec210fe715c3c90d18ddae1323de6cbd8e5348fca4b167ed2cf6cd1ddc", "1848726466b5f84e")

// 	serviceAcctAddr, serviceAcctKey, serviceSigner := ServiceAccount(flowClient, user.PrivateKey, user.Address)

// 	//create new vault for fiat token
// 	transaction := flow.NewTransaction().
// 		SetScript([]byte(`
// 		import FungibleToken from 0x9a0766d93b6608b7
// 		import FiatToken from 0xa983fecbed621163

// 		//set up vault for USDC
// 		transaction {

// 		  prepare(signer: AuthAccount) {

// 			// It's OK if the account already has a Vault, but we don't want to replace it
// 			if(signer.borrow<&FiatToken.Vault>(from: FiatToken.VaultStoragePath) != nil) {
// 			  return
// 			}

// 			// Create a new FUSD Vault and put it in storage
// 			signer.save(<-FiatToken.createEmptyVault(), to: FiatToken.VaultStoragePath)

// 			// Create a public capability to the Vault that only exposes
// 			// the deposit function through the Receiver interface
// 			signer.link<&FiatToken.Vault{FungibleToken.Receiver}>(
// 			  FiatToken.VaultReceiverPubPath,
// 			  target: FiatToken.VaultStoragePath
// 			)

// 			// Create a public capability to the Vault that only exposes
// 			// the balance field through the Balance interface
// 			signer.link<&FiatToken.Vault{FungibleToken.Balance}>(
// 			  FiatToken.VaultBalancePubPath,
// 			  target: FiatToken.VaultStoragePath
// 			)
// 		  }
// 		}

// 	`))

// 	referenceBlockID := base.GetReferenceBlockId(flowClient)

// 	transaction.SetProposalKey(
// 		serviceAcctAddr,
// 		serviceAcctKey.Index,
// 		serviceAcctKey.SequenceNumber,
// 	)
// 	transaction.SetReferenceBlockID(referenceBlockID)
// 	transaction.SetPayer(serviceAcctAddr)
// 	transaction.AddAuthorizer(serviceAcctAddr)

// 	// Sign the transaction with the service account, which already exists
// 	// All new accounts must be created by an existing account
// 	err = transaction.SignEnvelope(serviceAcctAddr, serviceAcctKey.Index, serviceSigner)
// 	base.Handle(err)

// 	// Send the transaction to the network
// 	err = flowClient.SendTransaction(ctx, *transaction)

// 	fmt.Println("ID", transaction.ID())

// 	// get latest block height
// 	latestBlock, err := flowClient.GetLatestBlock(ctx, true)

// 	//print the latest block height
// 	fmt.Println("Latest block height:", latestBlock.Height)

// 	time.Sleep(10 * time.Second)

// 	transactionRes := base.WaitForSeal(ctx, flowClient, transaction.ID())
// 	base.Handle(err)

// 	fmt.Println("Transaction status:", transactionRes.Status)

// }
