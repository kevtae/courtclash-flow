import FungibleToken from 0x9a0766d93b6608b7
import FiatToken from 0xa983fecbed621163


pub contract StakingV7 {
    // Event that is emitted when tokens are deposited to the fee vault
    pub event TokensDeposited(amount: UFix64)


    access(self) var vault: @FiatToken.Vault

    /// Get the balance of the Fees Vault
    pub fun getStakeBalance(): UFix64 {
        return self.vault.balance
    }

    pub fun getStakingPrice(): UFix64 {
        return self.stakingPrice
    }

    pub fun getStakers(): [staker] {
        return self.stakers
    }

    pub struct staker {
        pub let address: Address
        pub let submissionId: String
        pub var qualified: Bool

        init(_ AuthAccount: AuthAccount, _ submissionId: String){
            self.address = AuthAccount.address
            self.submissionId = submissionId
            self.qualified = false
        }

        pub fun setQualified(_ qualified: Bool) {
            self.qualified = qualified
        }

    }

    pub var stakers: [staker] 

    /// Staking Price
    pub let stakingPrice: UFix64

    /// Staking Price
    pub var stakedAmount: UFix64

    //challenge name
    pub var challengeName: String

    pub var qualifiedStakersNumber: UFix64

    pub resource Administrator {

        //function to qualifyStaker

        pub fun qualifyStaker(_ submissionId: String){
            var i = 0
            while i < StakingV7.stakers.length {
                if StakingV7.stakers[i].submissionId == submissionId {
                    StakingV7.stakers[i].setQualified(true)
                    StakingV7.qualifiedStakersNumber = StakingV7.qualifiedStakersNumber + 1.0000000
                }
                i = i + 1
            }
        }

        //distribute stake to stakers where qualified is true
        pub fun distributeStake(){
            var i = 0
            while i < StakingV7.stakers.length {
                if StakingV7.stakers[i].qualified {
                    let recipient= getAccount(StakingV7.stakers[i].address)
                    let receiverRef = recipient.getCapability(FiatToken.VaultReceiverPubPath)
                            .borrow<&{FungibleToken.Receiver}>()
                            ?? panic("Could not borrow receiver reference to the recipient's Vault")

                    let depositVault <- StakingV7.vault.withdraw(amount: StakingV7.vault.balance/StakingV7.qualifiedStakersNumber)
                    receiverRef.deposit(from: <-depositVault)
                }
                i = i + 1
            }
        }
    }



    //deposit fee
    pub fun depositStake(_ acct: AuthAccount, submissionId: String){
        var stakingAmount = self.stakingPrice

        let tokenVault = acct.borrow<&FiatToken.Vault>(from: FiatToken.VaultStoragePath)
            ?? panic("Unable to borrow reference to the default token vault")

        if stakingAmount > tokenVault.balance {
            return 
        }

        let depositVault <- tokenVault.withdraw(amount: stakingAmount)
        self.vault.deposit(from: <-depositVault)

        self.stakers.append(staker(acct, submissionId))

        emit TokensDeposited(amount: stakingAmount)
    }





  init(){
    self.stakingPrice = 2.0000000
    self.challengeName = "challenge 1"
    self.stakedAmount = 0.0000000
    self.stakers = []
    self.qualifiedStakersNumber = 0.0000000

    //create staking vault of usdc token
    self.vault <- FiatToken.createEmptyVault() as! @FiatToken.Vault


    //create admin resource
    self.account.save<@Administrator>(<-create Administrator(), to: /storage/StakingAdministrator)
  }


}
 