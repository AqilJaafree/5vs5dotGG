import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Button from '../components/ui/Button';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  
  // Access the wallet adapter context
  const { publicKey, connected, disconnect } = useWallet();

  // Format wallet address for display
  const formatWalletAddress = (address) => {
    if (!address) return '';
    const addressStr = address.toString();
    return `${addressStr.slice(0, 6)}...${addressStr.slice(-4)}`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      try {
        // If connected, we can use the publicKey to fetch user data
        if (connected && publicKey) {
          // Here you would typically fetch user data from your backend
          // For now, we'll use mock data
          const mockUserData = {
            username: 'Player123',
            walletAddress: publicKey.toString(),
            balance: {
              sol: 1.24,
              credits: 500,
            },
            nfts: 5,
            teams: 2,
            matchesPlayed: 10,
            wins: 7,
            losses: 3,
          };

          
          setUserData(mockUserData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setTimeout(() => {
        setLoading(false);
        }, 500);
      }
    };

    fetchUserData();
  }, [connected, publicKey]);

  // Handle manual disconnect
  const handleDisconnect = async () => {
    try {
      await disconnect();
      
      // Clear connection status in localStorage
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletType');
      
      // Redirect to connect wallet page
      // In a real app, you might want to use React Router's navigate here
      window.location.href = '/connect-wallet';
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4 max-h-[calc(100svh-10rem)] overflow-y-auto scrollbar-hide">
      <div className="bg-[#865DFF] rounded-xl p-4 mb-6">
        <div className="flex flex-col items-center">
          {/* Avatar/Profile Image */}
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-3">
            {publicKey ? (
              <span className="text-2xl font-bold text-purple-700">
                {userData?.username?.charAt(0).toUpperCase() || 'P'}
              </span>
            ) : (
              <span className="text-2xl font-bold text-purple-700">?</span>
            )}
          </div>
          
          {/* Username */}
          <h2 className="text-xl font-bold text-white mb-1">
            {userData?.username || 'Player'}
          </h2>
          
          {/* Wallet Address */}
          {publicKey && (
            <p className="text-white text-sm bg-[#191825] px-3 py-1 rounded-full mb-3">
              {formatWalletAddress(publicKey)}
            </p>
          )}
          
          {/* Wallet Connect/Disconnect Buttons */}
          <div className="mt-2 flex flex-col gap-3 w-full">
            {/* Wallet connection status */}
            <div className={`text-center text-sm ${connected ? 'text-green-300' : 'text-yellow-300'}`}>
              {connected ? '● Connected' : '○ Not Connected'}
            </div>
            
            {/* Solana Wallet Adapter Button - visible when not connected */}
            {!connected && (
              <div className="wallet-adapter-button-container flex justify-center">
                <WalletMultiButton />
              </div>
            )}
            
            {/* Custom disconnect button - visible when connected */}
            {connected && (
              <Button
                text="Disconnect Wallet"
                variant="danger"
                onClick={handleDisconnect}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Player Stats */}
      {userData && (
        <div className="bg-[#191825] rounded-xl p-4 mb-6">
          <h3 className="text-lg font-bold text-white mb-3">Player Stats</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-3">
              <h4 className="text-sm text-gray-400">SOL Balance</h4>
              <p className="text-xl font-bold text-white">{userData.balance.sol} SOL</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3">
              <h4 className="text-sm text-gray-400">Credits</h4>
              <p className="text-xl font-bold text-white">{userData.balance.credits}</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3">
              <h4 className="text-sm text-gray-400">NFTs Owned</h4>
              <p className="text-xl font-bold text-white">{userData.nfts}</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3">
              <h4 className="text-sm text-gray-400">Teams</h4>
              <p className="text-xl font-bold text-white">{userData.teams}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Match History Summary */}
      {userData && (
        <div className="bg-[#191825] rounded-xl p-4">
          <h3 className="text-lg font-bold text-white mb-3">Match History</h3>
          
          <div className="flex justify-between mb-4">
            <div className="text-center">
              <p className="text-sm text-gray-400">Matches</p>
              <p className="text-xl font-bold text-white">{userData.matchesPlayed}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-400">Wins</p>
              <p className="text-xl font-bold text-green-400">{userData.wins}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-400">Losses</p>
              <p className="text-xl font-bold text-red-400">{userData.losses}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-400">Win Rate</p>
              <p className="text-xl font-bold text-yellow-400">
                {userData.matchesPlayed > 0 
                  ? Math.round((userData.wins / userData.matchesPlayed) * 100) 
                  : 0}%
              </p>
            </div>
          </div>
          
          {/* Win/Loss Progress Bar */}
          <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-green-500"
              style={{ 
                width: `${userData.matchesPlayed > 0 
                  ? (userData.wins / userData.matchesPlayed) * 100 
                  : 0}%` 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;