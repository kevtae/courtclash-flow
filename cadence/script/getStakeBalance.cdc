import StakingV7 from 0xf3ecf4159841b043


// Get vault balance

pub fun main(): UFix64  {


    return StakingV7.getStakeBalance()


}

///flow scripts execute getStakeAmount.cdc -n testnet