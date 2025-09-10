import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contractAddresses } from '@/lib/wallet-config';
import { useChainId } from 'wagmi';

// Contract ABI - This should match your deployed contract
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_claimType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "submitClaim",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_claimId",
        "type": "uint256"
      }
    ],
    "name": "getClaimStatus",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getUserClaims",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const useEncipherContract = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const contractAddress = contractAddresses[chainId as keyof typeof contractAddresses];

  const submitClaim = async (claimType: string, description: string, amount: bigint) => {
    if (!isConnected || !contractAddress) {
      throw new Error('Wallet not connected or contract not deployed on this chain');
    }

    return writeContract({
      address: contractAddress,
      abi: CONTRACT_ABI,
      functionName: 'submitClaim',
      args: [claimType, description, amount],
    });
  };

  const getClaimStatus = (claimId: bigint) => {
    return useReadContract({
      address: contractAddress,
      abi: CONTRACT_ABI,
      functionName: 'getClaimStatus',
      args: [claimId],
      query: {
        enabled: !!contractAddress && !!claimId,
      },
    });
  };

  const getUserClaims = () => {
    return useReadContract({
      address: contractAddress,
      abi: CONTRACT_ABI,
      functionName: 'getUserClaims',
      query: {
        enabled: !!contractAddress && !!address,
      },
    });
  };

  return {
    contractAddress,
    isConnected,
    address,
    submitClaim,
    getClaimStatus,
    getUserClaims,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  };
};
