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

// Detect browser type
const detectBrowser = () => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    return 'opera';
  } else if (userAgent.includes('Chrome')) {
    return 'chrome';
  } else if (userAgent.includes('Firefox')) {
    return 'firefox';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    return 'safari';
  } else if (userAgent.includes('Edge') || userAgent.includes('Edg')) {
    return 'edge';
  } else {
    return 'unknown';
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
  const browserType = detectBrowser();

  // RPC endpoint for Solana connection
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Log browser type on mount
  useEffect(() => {
    console.log(`Browser detected: ${browserType}`);
  }, [browserType]);

  // Configure wallet adapters based on browser
  const wallets = useMemo(() => {
    const adapters = [];
    
    // For Opera, prioritize Solflare and use special configuration
    if (browserType === 'opera') {
      // Add Solflare with special config for Opera
      adapters.push(new SolflareWalletAdapter({ network }));
      adapters.push(new PhantomWalletAdapter());

      
      // Check for direct Solflare instance in Opera
      if (window.solflare) {
        console.log('Direct Solflare instance detected in Opera');
      }
    } else {
      // Standard configuration for other browsers
      adapters.push(new PhantomWalletAdapter());
      adapters.push(new SolflareWalletAdapter());
    }
    
    return adapters;
  }, [network, browserType]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider 
        wallets={wallets} 
        autoConnect={false}
        onError={(error) => console.error('Wallet error:', error)}
      >
        <WalletModalProvider>
          <WalletConnectionManager />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;