import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faLink, faShieldAlt, faCircleNotch } from '@fortawesome/free-solid-svg-icons';

// Import wallet adapter styles - custom styles will override these
import '@solana/wallet-adapter-react-ui/styles.css';
import './WalletAdapterStyles.css';

const WalletConnectPage = () => {
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  
  // Use the wallet adapter
  const { publicKey, connected } = useWallet();
  
  // Monitor wallet connection status
  useEffect(() => {
    if (connected && publicKey) {
      // Save connection status to localStorage
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', publicKey.toString());
      
      // Give a small delay to show the connected state before redirecting
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  }, [connected, publicKey, navigate]);
  
  return (
    <div className="h-[calc(100svh-8rem)] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#865DFF] rounded-xl shadow-xl p-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-purple-900 opacity-20"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-900 opacity-20"></div>
        
        {/* Header */}
        <div className="text-center mb-8 relative">
          <h1 className="text-2xl font-bold text-white mb-2">Connect Wallet</h1>
          <p className="text-white text-sm">
            Connect your Solana wallet to play the game
          </p>
        </div>
        
        {/* Connection status */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${
            connected ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
          }`}>
            <span className="mr-2">
              {connected ? '● Connected' : '○ Not Connected'}
            </span>
            {connected && <span className="text-xs">{publicKey.toString().slice(0, 6)}...{publicKey.toString().slice(-4)}</span>}
          </div>
        </div>
        
        {/* Wallet connection button */}
        <div className="wallet-adapter-button-container flex justify-center mb-8">
          <WalletMultiButton />
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded-lg text-white text-sm">
            {error}
          </div>
        )}
    
        {/* Info footer */}
        <div className="mt-8 text-center text-xs text-white text-opacity-70">
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