// File: src/config/wallet.js
// This is a new file to centralize wallet configuration

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';

// Configure Solana network
export const network = WalletAdapterNetwork.Devnet;
export const endpoint = clusterApiUrl(network);

// Since standard wallets are automatically added by the wallet adapter,
// we don't need to explicitly add Phantom and Solflare anymore
export const wallets = [];