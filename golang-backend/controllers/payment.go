package controllers

import (
	"context"
	"fmt"
	"golang-backend/responses"
	"net/http"
	"time"

	"golang-backend/base"

	"golang-backend/configs"

	"github.com/onflow/flow-go-sdk"

	"golang-backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/stripe/stripe-go/v74"
	"github.com/stripe/stripe-go/v74/paymentintent"

	"github.com/onflow/cadence"
	"github.com/onflow/flow-go-sdk/access"
	"github.com/onflow/flow-go-sdk/crypto"

	"go.mongodb.org/mongo-driver/bson"

	HTTPP "github.com/onflow/flow-go-sdk/access/http"
)

// payment intent for stripe
func SendPaymentIntent(c *fiber.Ctx) error {

	//get body json from request
	body := c.Body()
	str := string(body)

	fmt.Println(body)
	fmt.Println(str)

	stripe.Key = "sk_test_51J9HwGC27aEgmaoGn561Cp0sTGqYKMobdmQwXJigBCXia7XdmjYHonkizmPhOTDkFvmJRS5CMXBs6Q2I2NeuS6u2000P9Ceigs"

	params := &stripe.PaymentIntentParams{
		Amount: stripe.Int64(2000),
		AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
			Enabled: stripe.Bool(true),
		},
		Currency: stripe.String(string(stripe.CurrencyUSD)),
	}
	params.AddMetadata("address", str)

	pi, _ := paymentintent.New(params)

	//get clientSecret and send to frontend
	data := &fiber.Map{
		"clientSecret": pi.ClientSecret,
	}

	fmt.Println(data)

	return c.Status(http.StatusOK).JSON(responses.UserResponse{
		Status:  http.StatusOK,
		Message: "success",
		Data:    data,
	})

}

// retreive webhook from stripe
// calls staking function once payment is successful
func RetrieveWebhook(c *fiber.Ctx) error {
	body := c.Body()

	fmt.Println(body)

	//create vault for the user

	//fund the account with usdc

	return c.Status(http.StatusOK).JSON(responses.SimpleResponse{
		Status: http.StatusOK,
	})
}

// run flow transaction script to set up fiattoken vault
func setupVault(address string) {
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	//initialize fiatToken vault to the account
	//create a transaction to send to flow
	flowClient, err := HTTPP.NewClient(HTTPP.TestnetHost)
	base.Handle(err)

	userCollection := configs.GetCollection(configs.DB, "users")
	userFilter := bson.M{"address": address}
	userCursor, err := userCollection.Find(ctx, userFilter)
	// if err != nil {
	// 	return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
	// }

	var user models.User
	for userCursor.Next(ctx) {
		err := userCursor.Decode(&user)
		if err != nil {
			// return c.Status(http.StatusInternalServerError).JSON(responses.UserResponse{Status: http.StatusInternalServerError, Message: "error", Data: &fiber.Map{"data": err.Error()}})
		}
	}

	// serviceAcctAddr, serviceAcctKey, serviceSigner := ServiceAccount(flowClient, "983e58ec210fe715c3c90d18ddae1323de6cbd8e5348fca4b167ed2cf6cd1ddc", "1848726466b5f84e")

	serviceAcctAddr, serviceAcctKey, serviceSigner := ServiceAccount(flowClient, user.PrivateKey, user.Address)

	//create new vault for fiat token
	transaction := flow.NewTransaction().
		SetScript([]byte(`
		import FungibleToken from 0x9a0766d93b6608b7
		import FiatToken from 0xa983fecbed621163
		
		//set up vault for USDC 
		transaction {
		
		  prepare(signer: AuthAccount) {
		
			// It's OK if the account already has a Vault, but we don't want to replace it
			if(signer.borrow<&FiatToken.Vault>(from: FiatToken.VaultStoragePath) != nil) {
			  return
			}
			
			// Create a new FUSD Vault and put it in storage
			signer.save(<-FiatToken.createEmptyVault(), to: FiatToken.VaultStoragePath)
		
			// Create a public capability to the Vault that only exposes
			// the deposit function through the Receiver interface
			signer.link<&FiatToken.Vault{FungibleToken.Receiver}>(
			  FiatToken.VaultReceiverPubPath,
			  target: FiatToken.VaultStoragePath
			)
		
			// Create a public capability to the Vault that only exposes
			// the balance field through the Balance interface
			signer.link<&FiatToken.Vault{FungibleToken.Balance}>(
			  FiatToken.VaultBalancePubPath,
			  target: FiatToken.VaultStoragePath
			)
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

}

// run flow transaction script to send usdc to the user
func sendUsdc(amount int, address string) {
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	//initialize fiatToken vault to the account
	//create a transaction to send to flow
	flowClient, err := HTTPP.NewClient(HTTPP.TestnetHost)
	base.Handle(err)

	serviceAcctAddr, serviceAcctKey, serviceSigner := base.ServiceAccount(flowClient)

	//create new vault for fiat token
	transaction := flow.NewTransaction().
		SetScript([]byte(`
		import FungibleToken from 0x9a0766d93b6608b7
		import FiatToken from 0xa983fecbed621163
		import usdcVault from 0xf3ecf4159841b043
		
		//transfer usdc from vault to the account
		transaction(depositAmount: UFix64, recipient: Address) {
		
		
			prepare(admin: AuthAccount) {
				let adminRef = admin.borrow<&usdcVault.Administrator>(from: /storage/VaultAdmin)!
		
		
				adminRef.transferUSDC(depositAmount, recipient)
		
				 log("token transfered")
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
	transaction.AddArgument(cadence.NewAddress(flow.HexToAddress(address)))
	transaction.AddArgument(cadence.UFix64(amount))

	//add argument to transaction that convert amount to cadence

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

}

func serviceAccount(flowClient access.Client, key string, address string) (flow.Address, *flow.AccountKey, crypto.Signer) {
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
