import FungibleToken from 0x9a0766d93b6608b7
import FiatToken from 0xa983fecbed621163
import StakingV8 from 0xf3ecf4159841b043


//distribute the stake once the challenge ends
//only can be called by the admin
transaction() {


    prepare(admin: AuthAccount) {
        let adminRef = admin.borrow<&StakingV8.Administrator>(from: /storage/StakingAdministratorV8)!


        adminRef.distributeStake()

         log("token deposited")
    }

}


///flow transactions send ./distributeStake.cdc "test" -n testnet --signer acc2