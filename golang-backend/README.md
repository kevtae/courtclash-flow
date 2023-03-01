### Hi there!! 👋


This is backend of the code.

We're using [flow-go-sdk](https://github.com/onflow/flow-go-sdk) with [go-fiber](https://github.com/gofiber/fiber).

In cadence folder, you will see list of all smart contract and transcript that interacts with flow blockchain

We have two main [smart contract](https://testnet.flowscan.org/account/0xf3ecf4159841b043)
1. stakingV8
⋅⋅* depositStake - function for users to call to deposit their stake and submit their submission of them doing the challenge
⋅⋅* getStakeBalance - to see total usdc staked in a contract
⋅⋅* getStakers - to see all the people who has stake
⋅⋅* Admin privileges
⋅⋅⋅* approveSubmission - Approving the submission based on our [dashboard](https://github.com/kevtae/courtclash-flow/tree/master/dashboard/dashboard)
⋅⋅⋅* distributeStake - function to distribute stakes back to the winners
2. usdcVault
⋅⋅* setupVault - function that gets called when they sign up with email, and we initalize their addres to receive usdc Vault
⋅⋅* transferUSDCvault - when they make credit card purchase on app, and we automatically convert and transfer the usdc to their account
⋅⋅* getVaultAmount - to see total balance of vault for transparency 


