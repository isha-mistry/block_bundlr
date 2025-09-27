import { getAddress } from 'viem';

// RIF Relay Configuration for Rootstock Testnet (Chain ID: 31)
export const RIF_RELAY_CONFIG = {
  chainId: 31,
  rifTokenAddress: getAddress('0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE'),
  smartWalletFactoryAddress: getAddress('0xCBc3BC24da96Ef5606d3801E13E1DC6E98C5c877'),
  relayHubAddress: getAddress('0xAd525463961399793f8716b0D85133ff7503a7C2'),
  deployVerifierAddress: getAddress('0xc67f193Bb1D64F13FD49E2da6586a2F417e56b16'),
  relayVerifierAddress: getAddress('0xB86c972Ff212838C4c396199B27a0DBe45560df8'),
  batchTransactionVerifierAddress: getAddress('0xe94843C5fb22D6752049442Db3A03B7f8bfcAEe4'), // To be deployed
  rpcUrl: 'https://public-node.testnet.rsk.co',
  gasPrice: '0x3b9aca00', // 1 gwei
  maxFeePerGas: '0x3b9aca00',
  maxPriorityFeePerGas: '0x3b9aca00',
};

// RIF Token ABI (ERC20)
export const RIF_TOKEN_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_spender", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {"name": "_owner", "type": "address"},
      {"name": "_spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_to", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "_from", "type": "address"},
      {"name": "_to", "type": "address"},
      {"name": "_value", "type": "uint256"}
    ],
    "name": "transferFrom",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  }
] as const;

// Smart Wallet Factory ABI
export const SMART_WALLET_FACTORY_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "uint256", "name": "index", "type": "uint256"}
    ],
    "name": "getSmartWalletAddress",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "uint256", "name": "index", "type": "uint256"}
    ],
    "name": "deploySmartWallet",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "smartWallet", "type": "address"}],
    "name": "isDeployed",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Batch Transaction Verifier ABI
export const BATCH_TRANSACTION_VERIFIER_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "token", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "address", "name": "smartWallet", "type": "address"},
      {"internalType": "uint256", "name": "batchSize", "type": "uint256"},
      {"internalType": "uint256", "name": "gasLimit", "type": "uint256"},
      {"internalType": "uint256", "name": "nonce", "type": "uint256"},
      {"internalType": "uint256", "name": "expiry", "type": "uint256"}
    ],
    "name": "verify",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "token", "type": "address"}],
    "name": "acceptToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "batchSize", "type": "uint256"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "setMinTokenAmount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Gas cost tiers for different batch sizes
export const GAS_COST_TIERS = {
  1: 1,      // 1 RIF for 1 transaction
  2: 3,      // 3 RIF for 2-5 transactions
  5: 3,
  6: 5,      // 5 RIF for 6-10 transactions
  10: 5,
  11: 10,    // 10 RIF for 11-25 transactions
  25: 10,
  26: 15,    // 15 RIF for 26-50 transactions
  50: 15,
} as const;

export function getRequiredRifTokens(batchSize: number): number {
  if (batchSize <= 1) return GAS_COST_TIERS[1];
  if (batchSize <= 5) return GAS_COST_TIERS[2];
  if (batchSize <= 10) return GAS_COST_TIERS[6];
  if (batchSize <= 25) return GAS_COST_TIERS[11];
  if (batchSize <= 50) return GAS_COST_TIERS[26];
  return GAS_COST_TIERS[26]; // Max tier for larger batches
}
