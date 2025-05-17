// frontend/src/utils/nftUtils.js
import { PublicKey } from '@solana/web3.js';

// Backend API URL
const API_URL = 'http://localhost:3001/api';

/**
 * Claims an NFT by calling the backend API
 * 
 * @param {PublicKey} userWallet - The user's wallet public key
 * @param {string} mintAddress - The NFT mint address
 * @returns {Promise<object>} - Result with signature
 */
export const claimNFT = async (userWallet, mintAddress) => {
  try {
    console.log(`Claiming NFT ${mintAddress} for wallet ${userWallet.toString()}`);
    
    // Call backend API to handle the NFT transfer
    const response = await fetch(`${API_URL}/claim-nft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userWallet: userWallet.toString(),
        mintAddress
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to claim NFT');
    }
    
    const result = await response.json();
    
    // If successful, also record in localStorage for faster checks in the future
    if (result.success) {
      recordNFTClaim(userWallet, mintAddress);
    }
    
    return result;
    
  } catch (error) {
    console.error('Error claiming NFT:', error);
    throw error;
  }
};

/**
 * Checks if a user owns an NFT by calling the backend API
 * 
 * @param {PublicKey} userWallet - The user's wallet public key
 * @param {string} mintAddress - The NFT mint address
 * @returns {Promise<boolean>} - Whether the user owns the NFT
 */
export const checkNFTOwnership = async (userWallet, mintAddress) => {
  try {
    // Check localStorage first for fast response
    const claimedNFTs = JSON.parse(localStorage.getItem('claimedNFTs') || '{}');
    const walletAddress = userWallet.toString();
    
    // If we've recorded this claim in localStorage, return true immediately
    if (claimedNFTs[walletAddress] && claimedNFTs[walletAddress].includes(mintAddress)) {
      return true;
    }
    
    // Otherwise, check with the backend
    const response = await fetch(
      `${API_URL}/nft/check-ownership?walletAddress=${walletAddress}&mintAddress=${mintAddress}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to check NFT ownership');
    }
    
    const result = await response.json();
    
    // If the user owns the NFT according to the backend, record it in localStorage
    if (result.success && result.owned) {
      recordNFTClaim(userWallet, mintAddress);
    }
    
    return result.success && result.owned;
    
  } catch (error) {
    console.error('Error checking NFT ownership:', error);
    // Fall back to localStorage in case of API error
    const claimedNFTs = JSON.parse(localStorage.getItem('claimedNFTs') || '{}');
    const walletAddress = userWallet.toString();
    return claimedNFTs[walletAddress] && claimedNFTs[walletAddress].includes(mintAddress);
  }
};

/**
 * Records NFT claim in localStorage
 * 
 * @param {PublicKey} userWallet - The user's wallet public key
 * @param {string} mintAddress - The NFT mint address
 */
export const recordNFTClaim = (userWallet, mintAddress) => {
  try {
    const walletAddress = userWallet.toString();
    
    // Get currently claimed NFTs
    const claimedNFTs = JSON.parse(localStorage.getItem('claimedNFTs') || '{}');
    
    // Initialize array for this wallet if it doesn't exist
    if (!claimedNFTs[walletAddress]) {
      claimedNFTs[walletAddress] = [];
    }
    
    // Add this NFT to the wallet's claimed list if not already there
    if (!claimedNFTs[walletAddress].includes(mintAddress)) {
      claimedNFTs[walletAddress].push(mintAddress);
    }
    
    // Save back to localStorage
    localStorage.setItem('claimedNFTs', JSON.stringify(claimedNFTs));
    
  } catch (error) {
    console.error('Error recording NFT claim:', error);
  }
};