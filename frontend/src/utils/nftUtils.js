// src/utils/nftUtils.js
import { PublicKey } from '@solana/web3.js';

// Backend API URL
const API_URL = 'http://localhost:3001/api';

/**
 * Claims an NFT by calling the backend API and creates a player entity
 * 
 * @param {PublicKey} userWallet - The user's wallet public key
 * @param {string} mintAddress - The NFT mint address
 * @param {object} connection - Solana connection
 * @param {object} wallet - Wallet interface
 * @param {PublicKey} worldPda - Bolt world PDA
 * @returns {Promise<object>} - Result with signature
 */
export const claimNFT = async (userWallet, mintAddress, connection, wallet, worldPda) => {
  try {
    console.log(`Claiming NFT ${mintAddress} for wallet ${userWallet.toString()}`);
    
    // Step 1: Call backend API to handle the NFT transfer
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
    
    // If successful with the transfer, also create a player entity
    if (result.success && worldPda) {
      try {
        console.log('Transfer successful, now creating player entity...');
        
        // In a real implementation, this would use the Bolt SDK to:
        // 1. Create an entity
        // 2. Initialize the PlayerStats component 
        // 3. Set the initial stats
        
        // For now, we'll simulate this process
        const mockEntityPda = new PublicKey(
          shuffleString(mintAddress) // Just for simulation purposes
        );
        const mockComponentPda = new PublicKey(
          shuffleString(userWallet.toString()) // Just for simulation purposes
        );
        
        // Create default stats for a new player
        const defaultStats = {
          nftMint: new PublicKey(mintAddress),
          role: 'Unassigned', // Initially unassigned, set when adding to team
          mechanical: getRandomStat(),
          gameKnowledge: getRandomStat(),
          teamCommunication: getRandomStat(),
          adaptability: getRandomStat(),
          consistency: getRandomStat(),
          form: getRandomStat(),
          potential: getRandomStat(),
          matchesPlayed: 0,
          wins: 0,
          losses: 0
        };
        
        // Log what would happen in a real implementation
        console.log('Creating entity with stats:', defaultStats);
        console.log('Entity PDA (simulated):', mockEntityPda.toString());
        console.log('Component PDA (simulated):', mockComponentPda.toString());
        
        // Add entity and component info to result
        result.entityPda = mockEntityPda.toString();
        result.componentPda = mockComponentPda.toString();
        result.playerStats = defaultStats;
        
        // Simulate delay for entity creation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Player entity created successfully');
      } catch (entityError) {
        console.error('Error creating player entity:', entityError);
        // Don't fail the whole operation if entity creation fails
        // Just log the error and continue
      }
    }
    
    // If successful, also record in localStorage for faster checks in the future
    if (result.success) {
      recordNFTClaim(userWallet, mintAddress, result.entityPda, result.componentPda);
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
    const claimedNFTs = getClaimedNFTs();
    const walletAddress = userWallet.toString();
    
    // If we've recorded this claim in localStorage, return true immediately
    if (claimedNFTs[walletAddress] && 
        claimedNFTs[walletAddress].some(nft => nft.mintAddress === mintAddress)) {
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
    const claimedNFTs = getClaimedNFTs();
    const walletAddress = userWallet.toString();
    return claimedNFTs[walletAddress] && 
           claimedNFTs[walletAddress].some(nft => nft.mintAddress === mintAddress);
  }
};

/**
 * Records NFT claim in localStorage
 * 
 * @param {PublicKey} userWallet - The user's wallet public key
 * @param {string} mintAddress - The NFT mint address
 * @param {string} entityId - Optional entity ID if an entity was created
 * @param {string} componentId - Optional component ID if a component was created
 */
export const recordNFTClaim = (userWallet, mintAddress, entityId = null, componentId = null) => {
  try {
    const walletAddress = userWallet.toString();
    
    // Get currently claimed NFTs
    const claimedNFTs = getClaimedNFTs();
    
    // Initialize array for this wallet if it doesn't exist
    if (!claimedNFTs[walletAddress]) {
      claimedNFTs[walletAddress] = [];
    }
    
    // Add this NFT to the wallet's claimed list if not already there
    const existing = claimedNFTs[walletAddress].find(nft => nft.mintAddress === mintAddress);
    
    if (!existing) {
      claimedNFTs[walletAddress].push({
        mintAddress,
        claimedAt: new Date().toISOString(),
        entityId,
        componentId
      });
    } else if ((entityId || componentId) && (!existing.entityId || !existing.componentId)) {
      // Update with entity info if we have it now
      existing.entityId = entityId || existing.entityId;
      existing.componentId = componentId || existing.componentId;
    }
    
    // Save back to localStorage
    try {
      localStorage.setItem('claimedNFTs', JSON.stringify(claimedNFTs));
    } catch (storageError) {
      console.error('Error saving to localStorage:', storageError);
    }
    
  } catch (error) {
    console.error('Error recording NFT claim:', error);
  }
};

/**
 * Gets all claimed NFTs from localStorage
 * 
 * @returns {Object} - Object mapping wallet addresses to arrays of claimed NFTs
 */
export const getClaimedNFTs = () => {
  try {
    const claimedNFTs = localStorage.getItem('claimedNFTs');
    return claimedNFTs ? JSON.parse(claimedNFTs) : {};
  } catch (error) {
    console.error('Error getting claimed NFTs from localStorage:', error);
    return {};
  }
};

/**
 * Gets claimed NFTs for a specific wallet
 * 
 * @param {PublicKey} userWallet - The user's wallet public key
 * @returns {Array} - Array of claimed NFTs for this wallet
 */
export const getWalletClaimedNFTs = (userWallet) => {
  try {
    const walletAddress = userWallet.toString();
    const claimedNFTs = getClaimedNFTs();
    return claimedNFTs[walletAddress] || [];
  } catch (error) {
    console.error('Error getting wallet claimed NFTs:', error);
    return [];
  }
};

/**
 * Gets entity ID for a claimed NFT
 * 
 * @param {PublicKey} userWallet - The user's wallet public key
 * @param {string} mintAddress - The NFT mint address
 * @returns {string|null} - Entity ID if available
 */
export const getNFTEntityId = (userWallet, mintAddress) => {
  try {
    const walletAddress = userWallet.toString();
    const claimedNFTs = getClaimedNFTs();
    
    if (claimedNFTs[walletAddress]) {
      const nft = claimedNFTs[walletAddress].find(n => n.mintAddress === mintAddress);
      return nft ? nft.entityId : null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting NFT entity ID:', error);
    return null;
  }
};

// Helper function to generate random stats for simulation
function getRandomStat() {
  return Math.floor(Math.random() * 31) + 60; // Random number between 60-90
}

// Helper function to shuffle a string for generating mock addresses
function shuffleString(str) {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}