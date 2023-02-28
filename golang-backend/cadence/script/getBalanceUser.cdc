import FungibleToken from 0x9a0766d93b6608b7
import FiatToken from 0xa983fecbed621163


pub fun main(address: Address): UFix64 {
    let account = getAccount(address)
        .getCapability<&FiatToken.Vault{FungibleToken.Balance}>(
           FiatToken.VaultBalancePubPath
        )
        .borrow()
        ?? panic("Could not borrow Vault reference")

    return account.balance
}


//flow scripts execute getBalance.cdc "182c16c8f859ac2c" -n testnet 