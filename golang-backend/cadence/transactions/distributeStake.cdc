import FungibleToken from 0x9a0766d93b6608b7
import FiatToken from 0xa983fecbed621163
import StakingV7 from 0x053625ce33348c06


//distribute the stake once the challenge ends
//only can be called by the admin
transaction() {


    prepare(admin: AuthAccount) {
        let adminRef = admin.borrow<&StakingV7.Administrator>(from: /storage/StakingAdministrator)!


        adminRef.distributeStake()

         log("token deposited")
    }

}


///flow transactions send ./distributeStake.cdc "test" -n testnet --signer acc2