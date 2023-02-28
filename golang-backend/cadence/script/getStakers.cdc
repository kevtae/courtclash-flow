import StakingV8 from 0xf3ecf4159841b043


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

pub fun main(): [StakingV8.staker]  {


    return StakingV8.getStakers()

}