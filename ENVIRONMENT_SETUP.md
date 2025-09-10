# Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# WalletConnect Project ID
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Contract Addresses (deploy to each network and update)
VITE_CONTRACT_ADDRESS_SEPOLIA=0x0000000000000000000000000000000000000000
VITE_CONTRACT_ADDRESS_MAINNET=0x0000000000000000000000000000000000000000
VITE_CONTRACT_ADDRESS_POLYGON=0x0000000000000000000000000000000000000000
VITE_CONTRACT_ADDRESS_ARBITRUM=0x0000000000000000000000000000000000000000
VITE_CONTRACT_ADDRESS_OPTIMISM=0x0000000000000000000000000000000000000000

# FHE Configuration
VITE_FHE_NETWORK_URL=https://api.zama.ai
VITE_FHE_APP_ID=your_fhe_app_id
```

## Getting WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy the Project ID and paste it in your `.env.local` file

## Contract Deployment

1. Deploy the `EncipherClaimHub.sol` contract to your desired networks
2. Update the contract addresses in your `.env.local` file
3. Make sure to set the verifier and treasury addresses during deployment
