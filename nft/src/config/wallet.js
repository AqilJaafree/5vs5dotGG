// File: src/config/wallet.js
// Centralized wallet configuration for Solana devnet

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

// Configure Solana network - explicitly set to devnet
export const network = WalletAdapterNetwork.Devnet;

// Use the official devnet endpoint
export const endpoint = clusterApiUrl(network);
// Alternative RPC endpoints if the official one has rate limiting issues
// export const endpoint = 'https://api.devnet.solana.com';
// export const endpoint = 'https://solana-devnet.g.alchemy.com/v2/your-api-key'; // If using Alchemy
// export const endpoint = 'https://devnet.rpcpool.com/'; // RPC Pool

// Wallet adapters to include
export const getWallets = () => {
  return [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network })
  ];
};

// Utility function to check if the endpoint is devnet
export const isDevnet = (endpoint) => {
  const devnetIdentifiers = [
    'devnet',
    'api.devnet.solana.com',
    'solana-devnet'
  ];
  
  return devnetIdentifiers.some(id => endpoint.includes(id));
};