// src/services/solanaService.js
const { Connection, PublicKey, Keypair, Transaction } = require('@solana/web3.js');
const { 
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction,
  createTransferInstruction, 
  TOKEN_PROGRAM_ID
} = require('@solana/spl-token');
const { getProgramWalletKeypair } = require('../utils/walletUtils');

// Initialize Solana connection
const connection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  'confirmed'
);

// Get program wallet keypair
const programKeypair = getProgramWalletKeypair();
console.log('Program wallet public key:', programKeypair.publicKey.toString());

/**
 * Transfer NFT from program wallet to user wallet using SPL token transfer
 * 
 * @param {string} userWalletAddress - User's wallet address
 * @param {string} mintAddress - NFT mint address
 * @returns {Promise<object>} - Result with signature
 */
async function transferNFT(userWalletAddress, mintAddress) {
  try {
    console.log(`Transferring NFT ${mintAddress} to ${userWalletAddress}`);
    
    // Convert addresses to PublicKey objects
    const userWalletPublicKey = new PublicKey(userWalletAddress);
    const mintPublicKey = new PublicKey(mintAddress);
    const programWalletPublicKey = programKeypair.publicKey;
    
    console.log('User wallet:', userWalletPublicKey.toString());
    console.log('Mint address:', mintPublicKey.toString());
    console.log('Program wallet:', programWalletPublicKey.toString());
    
    // Get token accounts
    const programTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      programWalletPublicKey
    );
    
    const userTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      userWalletPublicKey
    );
    
    console.log('Program token account:', programTokenAccount.toString());
    console.log('User token account:', userTokenAccount.toString());
    
    // Check if the program owns the NFT
    try {
      const programTokenInfo = await connection.getTokenAccountBalance(programTokenAccount);
      console.log('Program token balance:', programTokenInfo.value.uiAmount);
      
      if (programTokenInfo.value.uiAmount === 0) {
        throw new Error(`Program wallet does not own NFT ${mintAddress}`);
      }
    } catch (err) {
      console.error('Error checking program token balance:', err);
      throw new Error(`Program wallet does not have a token account for NFT ${mintAddress}`);
    }
    
    // Check if user already has the NFT
    let userTokenAccountExists = false;
    try {
      const userTokenInfo = await connection.getAccountInfo(userTokenAccount);
      userTokenAccountExists = userTokenInfo !== null;
      
      if (userTokenAccountExists) {
        const userTokenBalance = await connection.getTokenAccountBalance(userTokenAccount);
        if (userTokenBalance.value.uiAmount > 0) {
          console.log(`User already owns NFT ${mintAddress}`);
          return {
            success: true,
            alreadyOwned: true,
            signature: null
          };
        }
      }
    } catch (err) {
      console.log('User token account does not exist yet');
      userTokenAccountExists = false;
    }
    
    // Create transaction
    const transaction = new Transaction();
    
    // If user token account doesn't exist, create it
    if (!userTokenAccountExists) {
      console.log('Creating user token account');
      transaction.add(
        createAssociatedTokenAccountInstruction(
          programWalletPublicKey, // payer
          userTokenAccount,       // associated token account
          userWalletPublicKey,    // owner
          mintPublicKey           // mint
        )
      );
    }
    
    // Add transfer instruction
    console.log('Adding transfer instruction');
    transaction.add(
      createTransferInstruction(
        programTokenAccount,     // source
        userTokenAccount,        // destination
        programWalletPublicKey,  // owner of source
        1                        // amount (1 for NFT)
      )
    );
    
    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = programWalletPublicKey;
    
    // Sign transaction with program wallet
    transaction.sign(programKeypair);
    
    // Send transaction
    console.log('Sending transaction');
    const signature = await connection.sendRawTransaction(
      transaction.serialize(),
      { skipPreflight: false, preflightCommitment: 'confirmed' }
    );
    
    console.log('Transaction sent:', signature);
    
    // Confirm transaction
    console.log('Confirming transaction');
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    console.log('Transaction confirmed:', confirmation);
    
    return {
      success: true,
      signature,
      mintAddress,
      userWalletAddress
    };
    
  } catch (error) {
    console.error('Error transferring NFT:', error);
    throw new Error(`Failed to transfer NFT: ${error.message}`);
  }
}

/**
 * Check if a wallet owns a specific NFT
 * 
 * @param {string} walletAddress - Wallet address to check
 * @param {string} mintAddress - NFT mint address to check
 * @returns {Promise<boolean>} - Whether the wallet owns the NFT
 */
async function checkNFTOwnership(walletAddress, mintAddress) {
  try {
    const walletPublicKey = new PublicKey(walletAddress);
    const mintPublicKey = new PublicKey(mintAddress);
    
    // Get the user's associated token account for this NFT
    const tokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      walletPublicKey
    );
    
    try {
      // Check if the account exists and has a balance
      const tokenAccountInfo = await connection.getTokenAccountBalance(tokenAccount);
      
      // If the account exists and has a balance > 0, the user owns the NFT
      return tokenAccountInfo && tokenAccountInfo.value.uiAmount > 0;
      
    } catch (err) {
      // If the account doesn't exist, this will throw an error
      return false;
    }
  } catch (error) {
    console.error('Error checking NFT ownership:', error);
    throw new Error(`Failed to check NFT ownership: ${error.message}`);
  }
}

/**
 * Get all NFTs owned by a wallet
 * 
 * @param {string} walletAddress - Wallet address to check
 * @returns {Promise<Array>} - Array of mint addresses owned by the wallet
 */
async function getWalletNFTs(walletAddress) {
  try {
    const walletPublicKey = new PublicKey(walletAddress);
    
    // Get all token accounts owned by the wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      walletPublicKey,
      { programId: TOKEN_PROGRAM_ID }
    );
    
    // Filter for NFTs (amount = 1)
    const nftAccounts = tokenAccounts.value.filter(account => {
      const amount = account.account.data.parsed.info.tokenAmount.uiAmount;
      return amount === 1;
    });
    
    // Extract mint addresses
    const mintAddresses = nftAccounts.map(account => 
      account.account.data.parsed.info.mint
    );
    
    return mintAddresses;
    
  } catch (error) {
    console.error('Error fetching wallet NFTs:', error);
    throw new Error(`Failed to fetch wallet NFTs: ${error.message}`);
  }
}

module.exports = {
  transferNFT,
  checkNFTOwnership,
  getWalletNFTs
};