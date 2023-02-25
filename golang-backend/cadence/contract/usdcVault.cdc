import FungibleToken from 0x9a0766d93b6608b7
import FiatToken from 0xa983fecbed621163

//distributes usdc token based on stripe webhook
pub contract usdcVault {
    // Event that is emitted when tokens are deposited to the fee vault
    pub event TokensDeposited(amount: UFix64)


    access(self) var vault: @FiatToken.Vault

    /// Get the balance of the Vault
    pub fun getVaultBalance(): UFix64 {
        return self.vault.balance
    }

    pub resource Administrator {

        //transfer USDC to the account
        pub fun transferUSDC(_ Amount: UFix64, _ addr: Address){
            let recipient= getAccount(addr)
            let receiverRef = recipient.getCapability(FiatToken.VaultReceiverPubPath)
                    .borrow<&{FungibleToken.Receiver}>()
                     ?? panic("Could not borrow receiver reference to the recipient's Vault")

           let depositVault <- usdcVault.vault.withdraw(amount: Amount)
             receiverRef.deposit(from: <-depositVault)

        }
    }



    //deposit fee
    pub fun depositUSDC(_ acct: AuthAccount, _ depositAmount: UFix64){
        let tokenVault = acct.borrow<&FiatToken.Vault>(from: FiatToken.VaultStoragePath)
            ?? panic("Unable to borrow reference to the default token vault")


        let depositVault <- tokenVault.withdraw(amount: depositAmount)
        self.vault.deposit(from: <-depositVault)

        emit TokensDeposited(amount: depositAmount)
    }





  init(){
    //create staking vault of usdc token
    self.vault <- FiatToken.createEmptyVault() as! @FiatToken.Vault


    //create admin resource
    self.account.save<@Administrator>(<-create Administrator(), to: /storage/VaultAdmin)
  }


}
 