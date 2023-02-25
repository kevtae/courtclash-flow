import usdcVault from 0xf3ecf4159841b043



// get vault balance
pub fun main(): UFix64  {


    return usdcVault.getVaultBalance()


}

// flow scripts execute ./getVaultAmount.cdc --network testnet