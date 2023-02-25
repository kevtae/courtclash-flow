import FungibleToken from 0x9a0766d93b6608b7
import FiatToken from 0xa983fecbed621163
import usdcVault from 0xf3ecf4159841b043


//deposit the USDC into vault
transaction(depositAmount: UFix64) {


    prepare(signer: AuthAccount) {
        usdcVault.depositUSDC(signer, depositAmount)

         log("token deposited")
    }

}

///flow transactions send ./depositStake.cdc "1.000000" -n testnet --signer acc2