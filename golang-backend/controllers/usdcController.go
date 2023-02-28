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

func GetBalance(c *fiber.Ctx) error {

	// Connect to the Flow testnet
	ctx := context.Background()
	flowClient, err := HTTPP.NewClient(HTTPP.TestnetHost)
	base.Handle(err)

	script := []byte(`
	import StakingV8 from 0xf3ecf4159841b043

		pub fun main(): UFix64  {
		
		
			return StakingV8.getStakeBalance()
		
		}
	`)

	balanceRes, err := flowClient.ExecuteScriptAtLatestBlock(ctx, script, nil)
	base.Handle(err)

	fmt.Println("Transaction status:", balanceRes)

	return c.Status(http.StatusCreated).JSON(responses.UserResponse{Status: http.StatusCreated, Message: "success", Data: &fiber.Map{"data": balanceRes}})

}
