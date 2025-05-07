// src/services/solana-service.js

import { PublicKey, Connection, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { SinglePoolProgram } from '@solana/spl-single-pool';
import { 
  createMint, 
  getOrCreateAssociatedTokenAccount, 
  mintTo, 
  createMintToInstruction 
} from '@solana/spl-token';
import { Metaplex } from '@metaplex-foundation/js';
import { getAssociatedTokenAddress } from '@solana/spl-token';

// Configure connection to Solana devnet
const SOLANA_RPC_ENDPOINT = 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_RPC_ENDPOINT);

// Configure the Single-Validator Stake Pool address
const STAKE_POOL_ADDRESS = new PublicKey('SVSPxpvHdN29nkVg9rPapPNDddN5DipNLRUFhyjFThE');
// Configure the credit token mint address (this would be your own token mint)
const CREDIT_TOKEN_MINT = new PublicKey('YourCreditTokenMintAddressHere');

/**
 * Mint an NFT player card
 * @param {Object} wallet - User's wallet
 * @param {Object} metadata - NFT metadata
 * @returns {Promise<Object>} - Transaction result and NFT address
 */
export const mintNftPlayer = async (wallet, metadata) => {
  try {
    // Create a Metaplex instance
    const metaplex = new Metaplex(connection).use({ 
      identity: wallet 
    });
    
    // Upload metadata to Arweave
    const { uri } = await metaplex.nfts().uploadMetadata({
      name: metadata.name,
      description: metadata.description,
      image: metadata.imageUrl,
      attributes: [
        {
          trait_type: "Mechanical Skill",
          value: metadata.mechanical.toString()
        },
        {
          trait_type: "Game Knowledge",
          value: metadata.gameKnowledge.toString()
        },
        {
          trait_type: "Team Communication",
          value: metadata.teamCommunication.toString()
        },
        {
          trait_type: "Credit Cost",
          value: metadata.creditCost.toString()
        },
        {
          trait_type: "Total Available",
          value: metadata.totalAvailable.toString()
        }
      ]
    });
    
    // Mint the NFT
    const { nft } = await metaplex.nfts().create({
      name: metadata.name,
      uri: uri,
      sellerFeeBasisPoints: 500, // 5% royalty
      maxSupply: metadata.totalAvailable
    });
    
    // Register NFT in your game's database or contract
    // This would be a separate call to your backend or on-chain program
    
    return {
      success: true,
      mint: nft.address.toString(),
      metadata: uri
    };
  } catch (error) {
    console.error('Error minting NFT:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Stake SOL using the Single-Validator Stake Pool
 * @param {Object} wallet - User's wallet
 * @param {number} amount - Amount to stake in SOL
 * @returns {Promise<Object>} - Transaction result
 */
export const stakeSOL = async (wallet, amount) => {
  try {
    // Create a transaction for staking
    const stakeTransaction = await SinglePoolProgram.deposit({
      connection,
      pool: STAKE_POOL_ADDRESS,
      userWallet: wallet.publicKey,
      amount: amount
    });
    
    // Sign and send the transaction
    const signature = await sendAndConfirmTransaction(
      connection,
      stakeTransaction,
      [wallet]
    );
    
    return {
      success: true,
      signature
    };
  } catch (error) {
    console.error('Error staking SOL:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Mint credit tokens based on staked amount
 * @param {Object} wallet - User's wallet
 * @param {number} stakedAmount - Amount staked in SOL
 * @returns {Promise<Object>} - Transaction result
 */
export const mintCreditTokens = async (wallet, stakedAmount) => {
  try {
    // Calculate credits (0.2 SOL = 1 credit)
    const creditAmount = Math.floor(stakedAmount / 0.2);
    
    // Get the user's token account
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      CREDIT_TOKEN_MINT,
      wallet.publicKey
    );
    
    // Create a transaction to mint credit tokens
    const transaction = new Transaction().add(
      createMintToInstruction(
        CREDIT_TOKEN_MINT,
        tokenAccount.address,
        wallet.publicKey, // Mint authority (this should be your authority in production)
        creditAmount
      )
    );
    
    // Sign and send the transaction
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [wallet]
    );
    
    return {
      success: true,
      signature,
      creditAmount
    };
  } catch (error) {
    console.error('Error minting credit tokens:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Claim an NFT player using credits
 * @param {Object} wallet - User's wallet
 * @param {string} nftMint - NFT mint address
 * @param {number} creditCost - Credit cost to claim the NFT
 * @returns {Promise<Object>} - Transaction result
 */
export const claimNftWithCredits = async (wallet, nftMint, creditCost) => {
  try {
    // Get the user's credit token account
    const userCreditAccount = await getAssociatedTokenAddress(
      CREDIT_TOKEN_MINT,
      wallet.publicKey
    );
    
    // Create a transaction to burn credit tokens
    const burnTransaction = new Transaction();
    
    // Add instruction to burn the required credits
    burnTransaction.add(
      createBurnInstruction(
        userCreditAccount,
        CREDIT_TOKEN_MINT,
        wallet.publicKey,
        creditCost
      )
    );
    
    // Sign and send the transaction
    const burnSignature = await sendAndConfirmTransaction(
      connection,
      burnTransaction,
      [wallet]
    );
    
    // In a real implementation, you would now:
    // 1. Transfer the NFT to the user
    // 2. Update availability in your database/contract
    
    return {
      success: true,
      signature: burnSignature
    };
  } catch (error) {
    console.error('Error claiming NFT with credits:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get total staked SOL for creator's NFTs
 * @param {PublicKey} creatorAddress - Creator's wallet address
 * @returns {Promise<Object>} - Staking stats
 */
export const getCreatorStakingStats = async (creatorAddress) => {
  try {
    // In a real implementation, you would:
    // 1. Query all NFTs created by this address
    // 2. Get staking data from contracts or indexer
    // 3. Calculate total staked amount and rewards
    
    // For demo purposes, we're returning mock data
    return {
      totalStaked: 1250.75,
      totalRewards: 97.25,
      stakingAPY: 7.7
    };
  } catch (error) {
    console.error('Error getting creator staking stats:', error);
    return {
      success: false,
      error: error.message
    };
  }
};