import StakingV7 from 0x053625ce33348c06


// Get staking balance

pub fun main(): UFix64  {


    return StakingV7.getStakeBalance()


}

///flow scripts execute getStakeAmount.cdc -n testnet