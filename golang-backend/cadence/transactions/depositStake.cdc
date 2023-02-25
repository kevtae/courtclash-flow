import FungibleToken from 0x9a0766d93b6608b7
import FiatToken from 0xa983fecbed621163
import StakingV7 from 0x053625ce33348c06


//deposit stake to participate in the challenge
transaction(submissionId: String) {


    prepare(signer: AuthAccount) {
        StakingV7.depositStake(signer, submissionId: submissionId)

         log("token deposited")
    }

}

///flow transactions send ./depositStake.cdc "test" -n testnet --signer acc2