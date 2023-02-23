package controllers

import (
	"context"
	"fmt"
	"golang-backend/base"
	"golang-backend/responses"
	"net/http"

	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/onflow/cadence"
	"github.com/onflow/flow-go-sdk"
	HTTPP "github.com/onflow/flow-go-sdk/access/http"
)

// func CreateWalletCircle(c *fiber.Ctx) error {
// 	id := uuid.New()

// 	url := "https://api-sandbox.circle.com/v1/wallets"

// 	payload := strings.NewReader(fmt.Sprintf("{\"idempotencyKey\":\"%s\"}", id.String()))

// 	req, _ := http.NewRequest("POST", url, payload)

// 	req.Header.Add("accept", "application/json")
// 	req.Header.Add("content-type", "application/json")

// 	token := os.Getenv("CIRCLE")

// 	req.Header.Add("authorization", fmt.Sprintf("Bearer %s", token))

// 	res, _ := http.DefaultClient.Do(req)

// 	defer res.Body.Close()
// 	body, _ := ioutil.ReadAll(res.Body)

// 	fmt.Println(res)
// 	fmt.Println(string(body))

// 	return c.Status(http.StatusOK).JSON(responses.UserResponse{
// 		Status:  http.StatusOK,
// 		Message: "success",
// 		Data:    &fiber.Map{"data": string(body)},
// 	})

// }

// // func CreateDepositAddress(c *fiber.Ctx) error {
// // 	newUUID := uuid.New().String()

// // 	url := "https://api-sandbox.circle.com/v1/businessAccount/wallets/addresses/deposit"

// // 	payload := strings.NewReader("{\"chain\":\"FLOW\",\"idempotencyKey\":\"" + newUUID + "\",\"currency\":\"USD\"}")

// // 	req, _ := http.NewRequest("POST", url, payload)

// // 	req.Header.Add("accept", "application/json")
// // 	req.Header.Add("content-type", "application/json")
// // 	req.Header.Add("authorization", "Bearer QVBJX0tFWTo3NDlhNTMxNzdjZWI1YzRiMWMyN2MyMzQ4YzBmMDQ2Mjo5ZGFmMWFmMGYwYzFlY2MzOTcwYzI0ZjkxOTdmNjdhNQ==")

// // 	res, _ := http.DefaultClient.Do(req)

// // 	defer res.Body.Close()
// // 	body, _ := ioutil.ReadAll(res.Body)

// // 	fmt.Println(res)
// // 	fmt.Println(string(body))

// // 	return c.Status(http.StatusOK).JSON(responses.UserResponse{
// // 		Status:  http.StatusOK,
// // 		Message: "success",
// // 		Data:    &fiber.Map{"data": string(body)},
// // 	})
// // }

// func CreateDepositAddress(c *fiber.Ctx) error {
// 	url := "https://api-sandbox.circle.com/v1/businessAccount/wallets/addresses/deposit"

// 	payload := strings.NewReader("{\"idempotencyKey\":\"559fb89d-ab85-4060-9fe2-88ed9fce7478\",\"chain\":\"FLOW\",\"currency\":\"USD\"}")

// 	req, _ := http.NewRequest("POST", url, payload)

// 	req.Header.Add("accept", "application/json")
// 	req.Header.Add("content-type", "application/json")
// 	req.Header.Add("authorization", "Bearer QVBJX0tFWTo3NDlhNTMxNzdjZWI1YzRiMWMyN2MyMzQ4YzBmMDQ2Mjo5ZGFmMWFmMGYwYzFlY2MzOTcwYzI0ZjkxOTdmNjdhNQ==")

// 	res, _ := http.DefaultClient.Do(req)

// 	defer res.Body.Close()
// 	body, _ := ioutil.ReadAll(res.Body)

// 	fmt.Println(res)
// 	fmt.Println(string(body))

// 	return c.Status(http.StatusOK).JSON(responses.UserResponse{
// 		Status:  http.StatusOK,
// 		Message: "success",
// 		Data:    &fiber.Map{"data": string(body)},
// 	})
// }

// send transaction to flow wallet of usdc
func SetupVault(c *fiber.Ctx) error {
	// Connect to the Flow testnet

	ctx := context.Background()
	flowClient, err := HTTPP.NewClient(HTTPP.TestnetHost)
	base.Handle(err)

	serviceAcctAddr, serviceAcctKey, serviceSigner := base.ServiceAccount(flowClient)

	transaction := flow.NewTransaction().
		SetScript([]byte(`
		import FungibleToken from 0x9a0766d93b6608b7
		import FiatToken from 0xa983fecbed621163

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

	time.Sleep(5 * time.Second)

	transactionRes := base.WaitForSeal(ctx, flowClient, transaction.ID())

	fmt.Println("Transaction status:", transactionRes.Status)

	return c.Status(http.StatusCreated).JSON(responses.UserResponse{Status: http.StatusCreated, Message: "success", Data: &fiber.Map{"data": transactionRes}})
}

func TransferUSDC(c *fiber.Ctx) error {

	// Connect to the Flow testnet
	ctx := context.Background()
	flowClient, err := HTTPP.NewClient(HTTPP.TestnetHost)
	base.Handle(err)

	serviceAcctAddr, serviceAcctKey, serviceSigner := base.ServiceAccount(flowClient)

	transaction := flow.NewTransaction().
		SetScript([]byte(`
		import FungibleToken from 0x9a0766d93b6608b7
		import FiatToken from 0xa983fecbed621163
		
		transaction(amount: UFix64, to: Address) {
		
			// The Vault resource that holds the tokens that are being transferred
			let sentVault: @FungibleToken.Vault
		
			prepare(signer: AuthAccount) {
		
				// Get a reference to the signer's stored vault
				let vaultRef = signer.borrow<&FiatToken.Vault>(from: FiatToken.VaultStoragePath)
					?? panic("Could not borrow reference to the owner's Vault!")
		
				// Withdraw tokens from the signer's stored vault
				self.sentVault <- vaultRef.withdraw(amount: amount)
			}
		
			execute {
		
				// Get the recipient's public account object
				let recipient = getAccount(to)
		
				// Get a reference to the recipient's Receiver
				let receiverRef = recipient.getCapability(FiatToken.VaultReceiverPubPath)
					.borrow<&{FungibleToken.Receiver}>()
					?? panic("Could not borrow receiver reference to the recipient's Vault")
		
				// Deposit the withdrawn tokens in the recipient's receiver
				receiverRef.deposit(from: <-self.sentVault)
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

	//add arguments
	transaction.AddArgument(cadence.UFix64(1))
	transaction.AddArgument(cadence.Address(flow.HexToAddress("0x053625ce33348c06")))

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

	time.Sleep(5 * time.Second)

	transactionRes := base.WaitForSeal(ctx, flowClient, transaction.ID())

	fmt.Println("Transaction status:", transactionRes.Status)

	return c.Status(http.StatusCreated).JSON(responses.UserResponse{Status: http.StatusCreated, Message: "success", Data: &fiber.Map{"data": transactionRes}})

}
