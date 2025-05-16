import React, { useState, useEffect, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { 
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

// Safe localStorage access with error handling
const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage.getItem:', error);
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error accessing localStorage.setItem:', error);
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error accessing localStorage.removeItem:', error);
    }
  }
};

// Create a component to handle wallet connection events
const WalletConnectionManager = () => {
  const { connected, publicKey } = useWallet();
  const [prevConnected, setPrevConnected] = useState(false);

  // Track previous connection state to avoid unnecessary updates
  useEffect(() => {
    // Only update localStorage when connection state actually changes
    if (connected !== prevConnected) {
      if (connected && publicKey) {
        console.log('Wallet connected - updating localStorage');
        safeLocalStorage.setItem('walletConnected', 'true');
      } else if (!connected && prevConnected) {
        console.log('Wallet disconnected - clearing localStorage');
        safeLocalStorage.removeItem('walletConnected');
      }
      setPrevConnected(connected);
    }
  }, [connected, publicKey, prevConnected]);

  return null; // This component doesn't render anything
};

const WalletContextProvider = ({ children }) => {
  // Set up network - you can change to 'mainnet-beta' for production
  const network = WalletAdapterNetwork.Devnet;

  // RPC endpoint for Solana connection
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Wallets that you want to support
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <WalletConnectionManager />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;