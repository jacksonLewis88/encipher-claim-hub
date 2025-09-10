# Encipher Claim Hub

A secure, privacy-preserving insurance claim management platform built with FHE (Fully Homomorphic Encryption) technology.

## Features

- **Secure Claims Processing**: All sensitive data is encrypted using FHE technology
- **Multi-Wallet Support**: Connect with various Web3 wallets including Rainbow, MetaMask, and more
- **Real-time Analytics**: Track claim status and processing metrics
- **Privacy-First Design**: Your data remains encrypted throughout the entire process

## Technologies

This project is built with:

- **Frontend**: Vite, TypeScript, React, shadcn-ui, Tailwind CSS
- **Blockchain**: Solidity, FHE (Fully Homomorphic Encryption)
- **Wallet Integration**: RainbowKit, Wagmi, Viem
- **UI Components**: Radix UI, Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jacksonLewis88/encipher-claim-hub.git
cd encipher-claim-hub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn-ui components
│   ├── ClaimsPortal.tsx
│   ├── Header.tsx
│   ├── NewClaimDialog.tsx
│   └── WalletComponent.tsx
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
└── contracts/          # Smart contracts
```

## Smart Contracts

The project includes FHE-enabled smart contracts for secure claim processing:

- **EncipherClaimHub.sol**: Main contract for claim management
- **FHE Integration**: All sensitive data is encrypted using Zama's FHE technology

## Wallet Integration

Supported wallets:
- Rainbow
- MetaMask
- WalletConnect
- Coinbase Wallet
- And more...

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_CONTRACT_ADDRESS=your_contract_address
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue on GitHub.