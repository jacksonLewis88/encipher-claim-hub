import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet, polygon, arbitrum, optimism } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Encipher Claim Hub',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: [sepolia, mainnet, polygon, arbitrum, optimism],
  ssr: false,
});

export const supportedChains = [sepolia, mainnet, polygon, arbitrum, optimism];

export const contractAddresses = {
  [sepolia.id]: import.meta.env.VITE_CONTRACT_ADDRESS_SEPOLIA || '0x0000000000000000000000000000000000000000',
  [mainnet.id]: import.meta.env.VITE_CONTRACT_ADDRESS_MAINNET || '0x0000000000000000000000000000000000000000',
  [polygon.id]: import.meta.env.VITE_CONTRACT_ADDRESS_POLYGON || '0x0000000000000000000000000000000000000000',
  [arbitrum.id]: import.meta.env.VITE_CONTRACT_ADDRESS_ARBITRUM || '0x0000000000000000000000000000000000000000',
  [optimism.id]: import.meta.env.VITE_CONTRACT_ADDRESS_OPTIMISM || '0x0000000000000000000000000000000000000000',
};
