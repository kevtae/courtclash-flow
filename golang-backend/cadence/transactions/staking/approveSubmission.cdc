import FungibleToken from 0x9a0766d93b6608b7
import FiatToken from 0xa983fecbed621163
import StakingV8 from 0xf3ecf4159841b043


//approve the submission of the staker so they qualify to reward
transaction(submissionId: String) {

    prepare(admin: AuthAccount) {

        let adminRef = admin.borrow<&StakingV8.Administrator>(from: /storage/StakingAdministratorV8)!

        adminRef.qualifyStaker(submissionId)

    }

}

/// flow transactions send ./changeQualify.cdc "test" -n testnet --signer acc2