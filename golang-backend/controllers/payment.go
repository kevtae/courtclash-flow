package controllers

import (
	"context"
	"encoding/json"
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

type PaymentIntentCreatedEvent struct {
	ID         string `json:"id"`
	Object     string `json:"object"`
	APIVersion string `json:"api_version"`
	Created    int64  `json:"created"`
	Data       struct {
		Object struct {
			ID                   string `json:"id"`
			Object               string `json:"object"`
			Amount               int64  `json:"amount"`
			AmountCapturable     int64  `json:"amount_capturable"`
			AmountReceived       int64  `json:"amount_received"`
			Application          string `json:"application"`
			ApplicationFeeAmount int64  `json:"application_fee_amount"`
			CanceledAt           string `json:"canceled_at"`
			CaptureMethod        string `json:"capture_method"`
			Charges              struct {
				Object     string        `json:"object"`
				Data       []interface{} `json:"data"`
				HasMore    bool          `json:"has_more"`
				TotalCount int           `json:"total_count"`
				URL        string        `json:"url"`
			} `json:"charges"`
			ClientSecret       string `json:"client_secret"`
			ConfirmationMethod string `json:"confirmation_method"`
			Currency           string `json:"currency"`
			Customer           string `json:"customer"`
			Description        string `json:"description"`
			Invoice            string `json:"invoice"`
			LastPaymentError   string `json:"last_payment_error"`
			LatestCharge       string `json:"latest_charge"`
			Livemode           bool   `json:"livemode"`
			Metadata           struct {
				Address string `json:"address"`
			} `json:"metadata"`
			NextAction           interface{} `json:"next_action"`
			OnBehalfOf           interface{} `json:"on_behalf_of"`
			PaymentMethod        interface{} `json:"payment_method"`
			PaymentMethodOptions struct {
				Card struct {
					Installments        interface{} `json:"installments"`
					MandateOptions      interface{} `json:"mandate_options"`
					Network             interface{} `json:"network"`
					RequestThreeDSecure string      `json:"request_three_d_secure"`
				} `json:"card"`
			} `json:"payment_method_options"`
			PaymentMethodTypes      []string    `json:"payment_method_types"`
			Status                  string      `json:"status"`
			TransferData            interface{} `json:"transfer_data"`
			TransferGroup           interface{} `json:"transfer_group"`
			AutomaticPaymentMethods struct {
				Enabled bool `json:"enabled"`
			} `json:"automatic_payment_methods"`
		} `json:"object"`
	} `json:"data"`
	Livemode        bool `json:"livemode"`
	PendingWebhooks int  `json:"pending_webhooks"`
	Request         struct {
		ID             string `json:"id"`
		IdempotencyKey string `json:"idempotency_key"`
	} `json:"request"`
	Type string `json:"type"`
}

// payment intent for stripe
func SendPaymentIntent(c *fiber.Ctx) error {

	// Get the query parameters from the request
	address := c.Query("address")

	stripe.Key = "sk_test_51J9HwGC27aEgmaoGn561Cp0sTGqYKMobdmQwXJigBCXia7XdmjYHonkizmPhOTDkFvmJRS5CMXBs6Q2I2NeuS6u2000P9Ceigs"

	params := &stripe.PaymentIntentParams{
		Amount: stripe.Int64(200),
		AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
			Enabled: stripe.Bool(true),
		},
		Currency: stripe.String(string(stripe.CurrencyUSD)),
	}
	params.AddMetadata("address", address)

	pi, _ := paymentintent.New(params)

	//get clientSecret and send to frontend
	data := &fiber.Map{
		"clientSecret": pi.ClientSecret,
	}

	// fmt.Println(data)

	return c.Status(http.StatusOK).JSON(responses.UserResponse{
		Status:  http.StatusOK,
		Message: "success",
		Data:    data,
	})

}

// retreive webhook from stripe
// calls staking function once payment is successful
func RetrieveWebhook(c *fiber.Ctx) error {

	var payload PaymentIntentCreatedEvent

	err := json.Unmarshal(c.Body(), &payload)
	if err != nil {
		fmt.Println(err)
	}

	address := payload.Data.Object.Metadata.Address

	fmt.Println("WEBHOOKD CALLED", address)

	//Callback function for transferFlow, setupVault, sendUsdc

	// func transferFlowCallback(address string, callback func()) {
	// 	// Call transferFlow function
	// 	transferFlow(address).Then(func() {
	// 		// Call setupVault function after transferFlow is complete
	// 		setupVault(address).Then(func() {
	// 			// Call sendUsdc function after setupVault is complete
	// 			sendUsdc(2, address).Then(func() {
	// 				// Call the callback function after sendUsdc is complete
	// 				callback()
	// 			})
	// 		})
	// 	})
	// }

	// transferFlowCallback(address, func() {
	// 	// Callback function
	// 	fmt.Println("All functions completed successfully!")
	// })

	transferFlow(address)

	setupVault(address)

	sendUsdc(2, address)

	// transferFlowCallback(address, func() {
	// 	// Callback function
	// 	fmt.Println("All functions completed successfully!")
	// })

	//create vault for the user

	//fund the account with usdc

	return c.Status(http.StatusOK).JSON(responses.SimpleResponse{
		Status: http.StatusOK,
	})
}

func transferFlow(address string) {
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	// amount := 20.00000000

	//initialize fiatToken vault to the account
	//create a transaction to send to flow
	flowClient, err := HTTPP.NewClient(HTTPP.TestnetHost)
	base.Handle(err)

	serviceAcctAddr, serviceAcctKey, serviceSigner := base.ServiceAccount(flowClient)

	//create new vault for fiat token
	transaction := flow.NewTransaction().
		SetScript([]byte(`
		import FungibleToken from 0x9a0766d93b6608b7

		transaction(to: Address) {
			let vault: @FungibleToken.Vault
			prepare(signer: AuthAccount) {
			self.vault <- signer
			.borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!
			.withdraw(amount: 20.00000000)
			}
			execute {
			getAccount(to)
			.getCapability(/public/flowTokenReceiver)!
			.borrow<&{FungibleToken.Receiver}>()!
			.deposit(from: <-self.vault)
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
	//add argument to transaction that convert amount to cadence
	// transaction.AddArgument(cadence.UFix64(amount))
	transaction.AddArgument(cadence.NewAddress(flow.HexToAddress(address)))

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
	base.Handle(err)

	fmt.Println("Transaction status:", transactionRes.Status)
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

	fmt.Println("ID", transaction.ID())

	// get latest block height
	latestBlock, err := flowClient.GetLatestBlock(ctx, true)

	//print the latest block height
	fmt.Println("Latest block height:", latestBlock.Height)

	time.Sleep(10 * time.Second)

	transactionRes := base.WaitForSeal(ctx, flowClient, transaction.ID())
	base.Handle(err)

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
		transaction(recipient: Address) {
		
		
			prepare(admin: AuthAccount) {
				let adminRef = admin.borrow<&usdcVault.Administrator>(from: /storage/VaultAdmin)!
		
		
				adminRef.transferUSDC(2.00000000, recipient)
		
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
	// transaction.AddArgument(cadence.UFix64(amount))

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

	time.Sleep(10 * time.Second)

	transactionRes := base.WaitForSeal(ctx, flowClient, transaction.ID())
	base.Handle(err)

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
