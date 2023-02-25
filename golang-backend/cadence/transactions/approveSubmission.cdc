import FungibleToken from 0x9a0766d93b6608b7
import FiatToken from 0xa983fecbed621163
import StakingV7 from 0xf3ecf4159841b043


//approve the submission of the staker so they qualify to reward
transaction(submissionId: String) {

    prepare(admin: AuthAccount) {

        let adminRef = admin.borrow<&StakingV7.Administrator>(from: /storage/StakingAdministrator)!

        adminRef.qualifyStaker(submissionId)

    }

}

/// flow transactions send ./changeQualify.cdc "test" -n testnet --signer acc2