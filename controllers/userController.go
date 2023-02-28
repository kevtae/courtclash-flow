package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"strings"
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
	"github.com/magiclabs/magic-admin-go/token"

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
	base.Handle(err)

	fmt.Println("Transaction status:", balanceRes)

	return c.Status(httpp.StatusCreated).JSON(responses.UserResponse{Status: httpp.StatusCreated, Message: "success", Data: &fiber.Map{"data": balanceRes}})

}

/*
Ensures the Decentralised ID Token (DIDT) sent by the client is valid
Saves the author's user info in context values ✨
*/
func checkBearerToken(next httpHandlerFunc) httpHandlerFunc {
	return func(res httpp.ResponseWriter, req *httpp.Request) {

		// Check whether or not DIDT exists in HTTP Header Request
		if !strings.HasPrefix(req.Header.Get("Authorization"), authBearer) {
			fmt.Fprintf(res, "Bearer token is required")
			return
		}

		// Retrieve DIDT token from HTTP Header Request
		didToken := req.Header.Get("Authorization")[len(authBearer)+1:]

		// Create a Token instance to interact with the DID token
		tk, err := token.NewToken(didToken)
		if err != nil {
			fmt.Fprintf(res, "Malformed DID token error: %s", err.Error())
			res.Write([]byte(err.Error()))
			return
		}

		// Validate the Token instance before using it
		if err := tk.Validate(); err != nil {
			fmt.Fprintf(res, "DID token failed validation: %s", err.Error())
			return
		}

		// Get the the user's information
		userInfo, err := magicSDK.User.GetMetadataByIssuer(tk.GetIssuer())
		if err != nil {
			fmt.Fprintf(res, "Error when calling GetMetadataByIssuer: %s", err.Error())
			return
		}

		// Use context values to store user's info
		ctx := context.WithValue(req.Context(), userInfoKey, userInfo)
		req = req.WithContext(ctx)
		next(res, req)
	}
}

// Save authenticated user info once they login from the client side ✨
func saveUserInfo(w httpp.ResponseWriter, r *httpp.Request) {
	fmt.Println("Endpoint Hit: save-user-info")

	// Get the authenticated author's info from context values
	userInfo := r.Context().Value(userInfoKey)
	userInfoMap := userInfo.(*magic.UserInfo)

	// Get body of our POST request
	reqBody, _ := ioutil.ReadAll(r.Body)
	var user models.User

	// Unmarshal JSON data into a new User struct
	json.Unmarshal(reqBody, &user)

	/*
		Marshal User struct into JSON data to
		access key-value pair.
	*/
	json.Marshal(user)

	/*
		If the email sent by the client does not match
		the email saved via Magic SDK, then it is an
		unauthorized login.
	*/
	if userInfoMap.Email != user.Email {
		fmt.Fprintf(w, "Unauthorized user login")
		return
	}

	/*
		If you wanted, you could call your application logic to save the user's info.
		E.g.
		logic.User.add(userInfoMap.Email, userInfoMap.Issuer, userInfo.PublicAddress)
	*/

	// Instead of saving the user's info, we'll just return it
	w.Write([]byte("Yay! User was able to login / sign up. 🪄 Email: " + user.Email))
}