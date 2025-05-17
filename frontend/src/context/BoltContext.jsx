// src/context/BoltContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';

// Define program IDs as constants
export const PROGRAM_IDS = {
  BOLT_WORLD: 'WorLD15A7CrDwLcLy4fRqtaTb9fbd8o8iqiEMUDse2n',
  PLAYER_STATS: '5VLAaXmJsdUeV66WQJKvwGd3cLfsM5ETnN3PXC9ny1jh',
};

// Create the context
const BoltContext = createContext(null);

export function BoltProvider({ children }) {
  const { publicKey, connected, signTransaction } = useWallet();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [world, setWorld] = useState(null);
  const [connection, setConnection] = useState(null);

  // Initialize connection when the component mounts
  useEffect(() => {
    const initConnection = async () => {
      try {
        const conn = new Connection(
          'https://api.devnet.solana.com',
          'confirmed'
        );
        setConnection(conn);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize Solana connection:', err);
        setError('Failed to connect to the blockchain. Please try again.');
        setLoading(false);
      }
    };

    initConnection();
  }, []);

  // Create a wallet interface for easier usage
  const wallet = {
    publicKey,
    connected,
    async sendTransaction(transaction) {
      if (!connected || !signTransaction) {
        throw new Error('Wallet not connected');
      }
      
      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
      
      const signed = await signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signed.serialize()
      );
      return signature;
    },
    async confirmTransaction(signature) {
      return await connection.confirmTransaction(signature);
    }
  };

  // Method to connect to or initialize a world
  const initializeWorld = async () => {
    if (!connected || !connection) {
      throw new Error('Wallet not connected or connection not initialized');
    }

    try {
      setLoading(true);
      
      // For now, we'll just check if we can find an existing world
      // In a full implementation, you would initialize a new world if none exists
      // This is simplified for this example
      const worldProgram = new PublicKey(PROGRAM_IDS.BOLT_WORLD);
      const worldAccounts = await connection.getProgramAccounts(worldProgram);
      
      if (worldAccounts.length > 0) {
        setWorld(worldAccounts[0].pubkey);
        console.log(`Found existing world: ${worldAccounts[0].pubkey.toString()}`);
      } else {
        console.log('No existing world found, would need to initialize');
        // In real implementation, you'd call the Bolt SDK to initialize a world
        setError('No game world found. Please initialize one first.');
      }
      
      setLoading(false);
      return worldAccounts.length > 0 ? worldAccounts[0].pubkey : null;
    } catch (err) {
      console.error('Failed to initialize world:', err);
      setError('Failed to connect to game world. Please try again.');
      setLoading(false);
      return null;
    }
  };

  // Context value to be provided
  const value = {
    loading,
    error,
    connected,
    world,
    connection,
    wallet,
    programIds: PROGRAM_IDS,
    initializeWorld,
  };

  return (
    <BoltContext.Provider value={value}>
      {children}
    </BoltContext.Provider>
  );
}

// Custom hook to use the Bolt context
export function useBolt() {
  const context = useContext(BoltContext);
  if (!context) {
    throw new Error('useBolt must be used within a BoltProvider');
  }
  return context;
}