// src/utils/nftUtils.js - Using proper Umi transaction serialization
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { 
  publicKey, 
  generateSigner,
  percentAmount,
  keypairIdentity,
  signerIdentity,
  TransactionBuilder,
  transactionBuilder,
  none,
  some
} from "@metaplex-foundation/umi";
import { Keypair, VersionedTransaction } from '@solana/web3.js';
import { toWeb3JsTransaction, fromWeb3JsTransaction } from '@metaplex-foundation/umi-web3js-adapters';

// Initialize Umi with proper transaction serialization support
export const initializeUmi = (connection, walletAdapter) => {
  console.log("Initializing Umi with proper transaction serialization");
  
  try {
    // Create Umi instance
    const umi = createUmi(connection.rpcEndpoint).use(mplTokenMetadata());
    
    if (walletAdapter && walletAdapter.publicKey) {
      console.log("Setting up wallet with public key:", walletAdapter.publicKey.toBase58());
      
      // Create a special adapter that handles transaction conversion
      const walletSigner = {
        publicKey: publicKey(walletAdapter.publicKey.toBase58()),
        signMessage: async (message) => {
          console.log("Signing message");
          const signedMessage = await walletAdapter.signMessage(message);
          return signedMessage instanceof Uint8Array ? signedMessage : new Uint8Array(signedMessage);
        },
        // The key change: convert Umi transaction to Web3.js transaction before signing
        signTransaction: async (umiTransaction) => {
          console.log("Converting Umi transaction to Web3.js transaction for signing");
          
          // Convert Umi transaction to Web3.js transaction
          const web3JsTransaction = toWeb3JsTransaction(umiTransaction);
          
          console.log("Signing Web3.js transaction with wallet");
          const signedWeb3JsTransaction = await walletAdapter.signTransaction(web3JsTransaction);
          
          console.log("Converting signed Web3.js transaction back to Umi transaction");
          // Convert the signed Web3.js transaction back to a Umi transaction
          return fromWeb3JsTransaction(signedWeb3JsTransaction);
        },
        signAllTransactions: async (umiTransactions) => {
          console.log("Converting multiple Umi transactions to Web3.js transactions");
          
          // Convert all Umi transactions to Web3.js transactions
          const web3JsTransactions = umiTransactions.map(tx => toWeb3JsTransaction(tx));
          
          console.log("Signing all Web3.js transactions with wallet");
          const signedWeb3JsTransactions = await walletAdapter.signAllTransactions(web3JsTransactions);
          
          console.log("Converting all signed Web3.js transactions back to Umi transactions");
          // Convert all signed Web3.js transactions back to Umi transactions
          return signedWeb3JsTransactions.map(tx => fromWeb3JsTransaction(tx));
        }
      };
      
      // Apply the wallet signer to Umi
      umi.use(signerIdentity(walletSigner));
      
      console.log("Umi identity set to:", umi.identity.publicKey.toString());
    } else {
      console.warn("No wallet connected");
    }
    
    return umi;
  } catch (error) {
    console.error("Error initializing Umi:", error);
    throw error;
  }
};

// Create a simple test transaction using Umi
export const createPlayerNFT = async (umi, playerData) => {
  try {
    console.log("Testing Umi transaction with wallet");
    
    // First test message signing
    try {
      console.log("Testing message signing");
      const message = new TextEncoder().encode(`Testing wallet for: ${playerData.name}`);
      const signature = await umi.identity.signMessage(message);
      console.log("Message signing successful");
    } catch (msgError) {
      console.error("Message signing failed:", msgError);
      throw new Error("Message signing failed. Please check your wallet connection.");
    }
    
    // Create a new mint for this test
    const mint = generateSigner(umi);
    console.log("Generated test mint address:", mint.publicKey.toString());
    
    try {
      console.log("Creating simple test transaction using Umi");
      
      // Create a simple empty transaction for testing
      const tx = transactionBuilder();
      
      console.log("Sending test transaction using Umi");
      const result = await tx.sendAndConfirm(umi);
      
      console.log("Transaction confirmed:", result.signature);
      
      return {
        mint: mint.publicKey,
        uri: "test-only",
        signature: result.signature
      };
    } catch (txError) {
      console.error("Transaction error:", txError);
      
      // Detailed error logging
      if (txError.logs) {
        console.error("Transaction logs:", txError.logs);
      }
      
      throw new Error(`Transaction failed: ${txError.message}`);
    }
  } catch (error) {
    console.error("Test failed:", error);
    throw error;
  }
};

// Get Solana Explorer URL
export const getExplorerUrl = (mintAddress, cluster = 'devnet') => {
  return `https://explorer.solana.com/address/${mintAddress}?cluster=${cluster}`;
};