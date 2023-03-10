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