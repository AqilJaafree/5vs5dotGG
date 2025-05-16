import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faLink, faShieldAlt, faCircleNotch, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';
import './WalletAdapterStyles.css';

// Safe localStorage access
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

// Detect browser
const detectBrowser = () => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    return 'Opera';
  } else if (userAgent.includes('Chrome')) {
    return 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    return 'Firefox';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    return 'Safari';
  } else if (userAgent.includes('Edge') || userAgent.includes('Edg')) {
    return 'Edge';
  } else {
    return 'Unknown Browser';
  }
};

const WalletConnectPage = () => {
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [redirectInProgress, setRedirectInProgress] = useState(false);
  const [reconnectionAttempted, setReconnectionAttempted] = useState(false);
  const [browserType, setBrowserType] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [detectedWallets, setDetectedWallets] = useState([]);
  
  // Use the wallet adapter
  const { publicKey, connected, disconnect, wallets } = useWallet();

  // Detect browser on mount
  useEffect(() => {
    setBrowserType(detectBrowser());
  }, []);
  
  // Track detected wallets
  useEffect(() => {
    if (wallets && wallets.length > 0) {
      setDetectedWallets(wallets.map(wallet => wallet.adapter.name));
      console.log("Available wallets:", wallets.map(wallet => wallet.adapter.name).join(", "));
    }
  }, [wallets]);
  
  // Handle errors
  const handleError = useCallback((message) => {
    console.error(message);
    setError(message);
    setTimeout(() => setError(null), 5000);
  }, []);
  
  // Handle successful connection
  const handleSuccessfulConnection = useCallback(() => {
    if (redirectInProgress) return;
    
    // Prevent multiple redirects
    setRedirectInProgress(true);
    
    // Save connection status to localStorage
    try {
      safeLocalStorage.setItem('walletConnected', 'true');
      console.log("Wallet connection saved to localStorage");
    } catch (err) {
      console.error("Error saving wallet connection:", err);
    }
    
    // Give a small delay to show the connected state before redirecting
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 1500);
  }, [navigate, redirectInProgress]);
  
  // Monitor wallet connection status
  useEffect(() => {
    console.log("Wallet connection state:", connected, "Redirect in progress:", redirectInProgress);
    
    if (connected && publicKey) {
      handleSuccessfulConnection();
    }
  }, [connected, publicKey, handleSuccessfulConnection]);
  
  // Clean up connection state on component mount
  useEffect(() => {
    const isAlreadyConnected = safeLocalStorage.getItem('walletConnected') === 'true';
    
    if (!connected && isAlreadyConnected) {
      console.log("Cleaning up previous wallet connection state");
      safeLocalStorage.removeItem('walletConnected');
    }
    
    return () => {
      // Clean up any potential issues when leaving the page
      if (redirectInProgress && !connected) {
        safeLocalStorage.removeItem('walletConnected');
      }
    };
  }, [connected, redirectInProgress]);
  
  // Handle manual wallet disconnection
  const handleDisconnectWallet = () => {
    try {
      disconnect();
      safeLocalStorage.removeItem('walletConnected');
      setRedirectInProgress(false);
      setReconnectionAttempted(false);
    } catch (err) {
      handleError("Failed to disconnect wallet: " + err.message);
    }
  };
  
  return (
    <div className="h-[calc(100svh-8rem)] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#865DFF] rounded-xl shadow-xl p-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-purple-900 opacity-20"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-900 opacity-20"></div>
        
        {/* Header */}
        <div className="text-center mb-6 relative">
          <h1 className="text-2xl font-bold text-white mb-2">Connect Wallet</h1>
          <p className="text-white text-sm">
            Connect your Solana wallet to play the game
          </p>
          {browserType && (
            <p className="text-xs text-white mt-2 opacity-70">
              Detected: {browserType} 
              <button 
                className="ml-2 text-purple-300 underline text-xs"
                onClick={() => setShowHelp(!showHelp)}
              >
                {showHelp ? "Hide help" : "Need help?"}
              </button>
            </p>
          )}
        </div>
        
        {/* Browser-specific help */}
        {showHelp && (
          <div className="mb-4 p-3 bg-purple-900 bg-opacity-40 rounded-lg text-white text-xs">
            <h3 className="font-bold mb-2">Wallet Connection Tips:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Ensure your wallet extension is installed and enabled</li>
              <li>If using a hardware wallet, make sure it's connected</li>
              <li>Some wallets may require you to unlock them first</li>
              <li>Try refreshing the page if wallet doesn't appear</li>
            </ul>
            {detectedWallets.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Available wallets:</p>
                <p>{detectedWallets.join(", ")}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Connection status */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${
            connected ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
          }`}>
            <span className="mr-2">
              {connected ? '● Connected' : '○ Not Connected'}
            </span>
            {connected && publicKey && (
              <span className="text-xs">
                {publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}
              </span>
            )}
            {redirectInProgress && connected && (
              <span className="ml-2 text-xs flex items-center">
                <FontAwesomeIcon icon={faCircleNotch} className="animate-spin mr-1" />
                Redirecting...
              </span>
            )}
          </div>
        </div>
        
        {/* Wallet connection buttons */}
        <div className="flex flex-col items-center space-y-4 mb-6">
          {!connected ? (
            <div className="wallet-adapter-button-container flex justify-center w-full">
              <WalletMultiButton />
            </div>
          ) : redirectInProgress ? (
            <button 
              className="bg-gray-700 text-white py-2 px-4 rounded-lg opacity-50 cursor-not-allowed w-full"
              disabled
            >
              <FontAwesomeIcon icon={faCircleNotch} className="animate-spin mr-2" />
              Connecting...
            </button>
          ) : (
            <div className="flex flex-col space-y-3 w-full">
              <button 
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                onClick={() => navigate('/', { replace: true })}
              >
                Continue to Game
              </button>
              <button 
                className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors"
                onClick={handleDisconnectWallet}
              >
                Disconnect Wallet
              </button>
            </div>
          )}
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded-lg text-white text-sm flex items-start">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 mt-1" />
            <div>{error}</div>
          </div>
        )}
    
        {/* Info footer */}
        <div className="mt-4 text-center text-xs text-white text-opacity-70">
          <p className="mb-2">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faLink} className="mr-1" />
              <span>Solana Blockchain</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faShieldAlt} className="mr-1" />
              <span>Secure connection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectPage;