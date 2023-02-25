import StakingV7 from 0x053625ce33348c06


// This script allows you to get all the stakers in the staking contract

    pub struct staker {
        pub let address: Address
        pub let submissionId: String
        pub let qualified: Bool

        init(_ AuthAccount: AuthAccount, _ submissionId: String){
            self.address = AuthAccount.address
            self.submissionId = submissionId
            self.qualified = false
        }

    }

pub fun main(): [StakingV7.staker]  {


    return StakingV7.getStakers()

}