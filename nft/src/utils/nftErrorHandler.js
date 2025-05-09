// src/utils/nftErrorHandler.js

/**
 * Parses and formats common Solana and Metaplex NFT errors into user-friendly messages
 * Based on Solana cookbook examples
 */
export const handleNftError = (error) => {
  console.error("NFT Error:", error);
  
  // Extract the error message
  const message = error.message || error.toString();
  
  // Common error patterns and user-friendly responses
  if (message.includes('serialize')) {
    return "Transaction signing failed. Make sure your wallet is compatible with Solana devnet.";
  }
  
  if (message.includes('not connected')) {
    return "Your wallet is not connected. Please connect your wallet and try again.";
  }
  
  if (message.includes('upload') || message.includes('Irys') || message.includes('Arweave')) {
    return "Failed to upload metadata. This might be a temporary issue with the storage service. Please try again.";
  }
  
  if (message.includes('network') || message.includes('timeout')) {
    return "Network connection issue. Check your internet connection and try again.";
  }
  
  if (message.includes('insufficient balance') || message.includes('insufficient funds')) {
    return "Insufficient SOL balance for this transaction. You need some devnet SOL to mint NFTs.";
  }
  
  if (message.includes('Blockhash not found') || message.includes('expired')) {
    return "Transaction timed out. Please try again.";
  }
  
  if (message.includes('rejected')) {
    return "Transaction was rejected by your wallet. Please approve the transaction to mint the NFT.";
  }
  
  // Default generic error message
  return `Error creating NFT: ${message}`;
};

/**
 * Checks if the user likely needs devnet SOL
 */
export const needsDevnetSol = (error) => {
  const message = error.message || error.toString();
  return message.includes('insufficient balance') || 
         message.includes('insufficient funds') ||
         message.includes('0 lamports');
};

/**
 * Get instructions based on error type
 */
export const getErrorInstructions = (error) => {
  if (needsDevnetSol(error)) {
    return "Get devnet SOL from https://solfaucet.com";
  }
  
  const message = error.message || error.toString();
  
  if (message.includes('serialize') || message.includes('wallet')) {
    return "Try using Phantom or Solflare wallet";
  }
  
  return "Try again or check your internet connection";
};