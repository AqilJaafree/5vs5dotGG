// src/utils/walletAdapter.js
import { publicKey } from "@metaplex-foundation/umi";

/**
 * Creates a Umi-compatible signer from a wallet adapter
 * Based on Solana Cookbook & Metaplex documentation best practices
 */
export const createSignerFromWalletAdapter = (walletAdapter) => {
  if (!walletAdapter.publicKey) {
    throw new Error('Wallet not connected');
  }

  // Create a signer that uses the wallet adapter
  return {
    publicKey: publicKey(walletAdapter.publicKey.toBase58()),
    signMessage: async (message) => {
      try {
        // Sign the message using the wallet adapter
        return await walletAdapter.signMessage(message);
      } catch (error) {
        console.error("Error signing message:", error);
        throw error;
      }
    },
    signTransaction: async (transaction) => {
      try {
        // For Umi, we need to prepare the transaction for the wallet
        // This approach follows the Metaplex documentation recommendations
        const preparedTx = transaction.build();
        
        // Some wallet adapters have limitations with Umi transactions
        // Log details to help with debugging if needed
        console.log("Signing transaction...");
        
        const signedTx = await walletAdapter.signTransaction(preparedTx);
        return signedTx;
      } catch (error) {
        console.error("Error signing transaction:", error);
        
        // Provide more detailed error information
        if (error.message?.includes('serialize')) {
          console.error("Transaction serialization error - this is likely a wallet compatibility issue");
          throw new Error("Your wallet had trouble signing this transaction. Make sure you're using a compatible wallet like Phantom or Solflare that supports Solana devnet.");
        }
        
        throw error;
      }
    },
    signAllTransactions: async (transactions) => {
      try {
        // Similar to signTransaction but for multiple transactions
        const preparedTxs = transactions.map(tx => tx.build());
        return await walletAdapter.signAllTransactions(preparedTxs);
      } catch (error) {
        console.error("Error signing multiple transactions:", error);
        throw error;
      }
    },
  };
};