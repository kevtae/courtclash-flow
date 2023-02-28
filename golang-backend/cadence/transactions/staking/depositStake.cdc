import FungibleToken from 0x9a0766d93b6608b7
import FiatToken from 0xa983fecbed621163
import StakingV8 from 0xf3ecf4159841b043


//deposit stake to participate in the challenge
transaction(submissionId: String) {


    prepare(signer: AuthAccount) {
        StakingV8.depositStake(signer, submissionId: submissionId)

         log("token deposited")
    }

}

///flow transactions send ./depositStake.cdc "test" -n testnet --signer acc2