// src/utils/walletUtils.js
const { Keypair } = require('@solana/web3.js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * Get the program wallet keypair from environment variable
 * @returns {Keypair} - Solana keypair
 */
function getProgramWalletKeypair() {
  try {
    // Get the secret key from environment variable
    const secretKeyString = process.env.PROGRAM_WALLET_SECRET_KEY;
    
    if (!secretKeyString) {
      throw new Error('Program wallet secret key not found in environment variables');
    }
    
    // Parse the JSON array
    let secretKeyArray;
    try {
      secretKeyArray = JSON.parse(secretKeyString);
    } catch (e) {
      throw new Error(`Invalid secret key format: ${e.message}`);
    }
    
    // Create the keypair
    const keypair = Keypair.fromSecretKey(new Uint8Array(secretKeyArray));
    console.log('Program wallet public key:', keypair.publicKey.toString());
    
    return keypair;
  } catch (error) {
    console.error('Error loading program wallet keypair:', error);
    throw new Error(`Failed to load program wallet: ${error.message}`);
  }
}

module.exports = {
  getProgramWalletKeypair
};