// src/services/playerStatsService.js
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { BorshAccountsCoder } from '@coral-xyz/anchor';
import { PROGRAM_IDS } from '../context/BoltContext';

// Create a BorshCoder for the PlayerStats account
const playerStatsCoder = new BorshAccountsCoder({
  types: [
    {
      name: 'BoltMetadata',
      type: {
        kind: 'struct',
        fields: [
          { name: 'authority', type: 'pubkey' }
        ]
      }
    },
    {
      name: 'PlayerStats',
      type: {
        kind: 'struct',
        fields: [
          { name: 'nft_mint', type: 'pubkey' },
          { name: 'role', type: 'string' },
          { name: 'mechanical', type: 'u8' },
          { name: 'game_knowledge', type: 'u8' },
          { name: 'team_communication', type: 'u8' },
          { name: 'adaptability', type: 'u8' },
          { name: 'consistency', type: 'u8' },
          { name: 'form', type: 'u8' },
          { name: 'potential', type: 'u8' },
          { name: 'matches_played', type: 'u32' },
          { name: 'wins', type: 'u32' },
          { name: 'losses', type: 'u32' },
          { name: 'bolt_metadata', type: { defined: 'BoltMetadata' } }
        ]
      }
    }
  ]
});

/**
 * Find Player Stats PDAs for a given entity
 */
export async function findPlayerStatsPda(entityPda) {
  const [pda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('component'),
      entityPda.toBuffer(),
      new PublicKey(PROGRAM_IDS.PLAYER_STATS).toBuffer()
    ],
    new PublicKey(PROGRAM_IDS.PLAYER_STATS)
  );
  
  return pda;
}

/**
 * Create an entity and initialize player stats
 */
export async function createPlayerEntity(
  connection,
  wallet,
  worldPda,
  nftMint,
  role,
  stats
) {
  if (!connection || !wallet.connected || !worldPda) {
    throw new Error('Connection not initialized or wallet not connected');
  }

  try {
    // In a full implementation, you would:
    // 1. Create an entity using the Bolt SDK
    // 2. Initialize the PlayerStats component
    // 3. Set the initial stats
    
    // This is a placeholder implementation
    console.log('Creating player entity for NFT mint:', nftMint);
    console.log('Role:', role);
    console.log('Stats:', stats);
    
    // Return a mock entity ID for now
    const mockEntityId = new PublicKey('BxQ1MLKXzGA1idqMMdSiK5LztyFdv2ks4Go8rryBTP31');
    return {
      entityPda: mockEntityId,
      componentPda: await findPlayerStatsPda(mockEntityId)
    };
  } catch (error) {
    console.error('Error creating player entity:', error);
    throw error;
  }
}

/**
 * Get player stats for an entity
 */
export async function getPlayerStats(connection, componentPda) {
  try {
    const accountInfo = await connection.getAccountInfo(componentPda);
    if (!accountInfo) {
      return null;
    }
    
    // Decode the account data
    const decoded = playerStatsCoder.decode('PlayerStats', accountInfo.data);
    return decoded;
  } catch (error) {
    console.error('Error fetching player stats:', error);
    throw error;
  }
}

/**
 * Update player form (this would be called after matches)
 */
export async function updatePlayerForm(
  connection,
  wallet,
  componentPda,
  newFormValue
) {
  try {
    // This would be implemented with the Bolt SDK in a full implementation
    // For now, just log what would happen
    console.log('Updating player form to:', newFormValue);
    console.log('Component PDA:', componentPda.toString());
    
    // Return a mock transaction ID
    return "mock_transaction_signature";
  } catch (error) {
    console.error('Error updating player form:', error);
    throw error;
  }
}