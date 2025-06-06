import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faLink, faShieldAlt, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/ui/Button';

const WalletConnectPage = () => {
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [error, setError] = useState(null);
  
  // Available wallet options
  const wallets = [
    { id: 'phantom', name: 'Phantom', icon: '👻' },
  ];
  
  // Handle connect wallet
  const handleConnectWallet = async (walletId) => {
    try {
      setError(null);
      setSelectedWallet(walletId);
      setConnecting(true);
      
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if wallet is installed
      const walletInstalled = walletId === 'metamask' || walletId === 'coinbase';
      
      if (!walletInstalled) {
        throw new Error(`${wallets.find(w => w.id === walletId).name} not detected. Please install the wallet extension.`);
      }
      
      // Simulate successful connection
      setTimeout(() => {
        // Save wallet connection to localStorage
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('walletType', walletId);
        
        // Navigate to home page
        navigate('/');
      }, 1000);
      
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message);
      setConnecting(false);
    }
  };
  
  return (
    <div className="h-[calc(100svh-8rem)] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#865DFF] rounded-xl shadow-xl p-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-purple-900 opacity-20"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-900 opacity-20"></div>
        
        {/* Header */}
        <div className="text-center mb-4 relative">
          <h1 className="text-2xl font-bold text-white mb-2">Connect Wallet</h1>
          <p className="text-white text-xs">
            Connect your wallet to play
          </p>
        </div>
        
        {/* Wallet options */}
        <div className="space-y-3 relative">         
          {/* Wallets */}
          <div>
            <div className="space-y-2">
              {wallets.filter(wallet => !wallet.popular).map(wallet => (
                <button
                  key={wallet.id}
                  onClick={() => handleConnectWallet(wallet.id)}
                  disabled={connecting}
                  className={`
                    relative w-full p-3 rounded-lg border border-[#191825] bg-[#191825]
                    flex items-center transition-all
                    ${connecting && selectedWallet === wallet.id 
                      ? 'border-purple-500 bg-purple-900 bg-opacity-20' 
                      : 'hover:border-purple-500 hover:bg-gray-700'
                    }
                  `}
                >
                  <div className="mr-3 text-xl">{wallet.icon}</div>
                  <div className="text-white">{wallet.name}</div>
                  {connecting && selectedWallet === wallet.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#191825] bg-opacity-70 rounded-lg">
                      <FontAwesomeIcon icon={faCircleNotch} spin className="text-purple-500 text-xl" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded-lg text-white text-sm">
            {error}
          </div>
        )}
    
        {/* Info footer */}
        {/* <div className="mt-8 text-center text-xs text-gray-500">
          <p className="mb-2">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
          </p>
          <div className="flex justify-center gap-6">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faLink} className="mr-1" />
              <span>Blockchain connection</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faShieldAlt} className="mr-1" />
              <span>Secure connection</span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default WalletConnectPage;