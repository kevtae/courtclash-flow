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

//flow transactions send ./transferUsdcVault.cdc "0.500000" "0xf3ecf4159841b043" -n testnet --signer acc2