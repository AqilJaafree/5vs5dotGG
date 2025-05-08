// src/pages/Mint.jsx
import { useState, useEffect, useMemo } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import ParticlesBackground from "../components/ParticlesBackground";
import { 
  initializeUmi, 
  createPlayerNFT, 
  createCanvasImage, 
  getExplorerUrl 
} from '../utils/umiNftMinting';

const Mint = () => {
  const { publicKey } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();
  
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [mintAddress, setMintAddress] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [playerData, setPlayerData] = useState({
    name: '',
    position: '',
    mechanical: 50,
    gameKnowledge: 50,
    teamCommunication: 50,
    adaptability: 50,
    consistency: 50,
    form: 50,
    potential: 50,
  });
  
  const positions = ['Midlaner', 'Toplaner', 'ADC', 'Support', 'Jungler'];
  
  // Initialize Umi
  const umi = useMemo(() => {
    if (connection) {
      return initializeUmi(connection, wallet);
    }
    return null;
  }, [connection, wallet]);
  
  // Update preview when player data changes
  useEffect(() => {
    const updatePreview = async () => {
      if (playerData.name || playerData.position) {
        const image = await createCanvasImage(
          playerData.name,
          playerData.position,
          {
            Mechanical: playerData.mechanical,
            'Game Knowledge': playerData.gameKnowledge,
            'Team Communication': playerData.teamCommunication
          }
        );
        setPreviewImage(image);
      }
    };
    
    updatePreview();
  }, [playerData]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerData({
      ...playerData,
      [name]: value,
    });
  };
  
  const mintNFT = async () => {
    if (!publicKey) {
      setMessage('Please connect your wallet first');
      return;
    }
    
    if (!playerData.name || !playerData.position) {
      setMessage('Please provide a name and position for your player');
      return;
    }
    
    try {
      setIsCreating(true);
      setMessage('Creating player NFT. Please approve the transaction...');
      setSuccess(false);
      
      // Create the NFT using Umi
      const result = await createPlayerNFT(umi, playerData);
      
      setMintAddress(result.mint.toString());
      setSuccess(true);
      setMessage(`Successfully created player NFT: ${playerData.name}`);
      
    } catch (error) {
      console.error('Error creating NFT:', error);
      setSuccess(false);
      setMessage(`Error creating NFT: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };
  
  const statsToDisplay = [
    { key: 'mechanical', label: 'Mechanical' },
    { key: 'gameKnowledge', label: 'Game Knowledge' },
    { key: 'teamCommunication', label: 'Team Communication' },
    { key: 'adaptability', label: 'Adaptability' },
    { key: 'consistency', label: 'Consistency' },
    { key: 'form', label: 'Form' },
    { key: 'potential', label: 'Potential' },
  ];
  
  const getTotalRating = () => {
    const total = statsToDisplay.reduce((sum, stat) => sum + parseInt(playerData[stat.key]), 0);
    return Math.floor(total / statsToDisplay.length);
  };
  
  const getRarityFromRating = (rating) => {
    if (rating >= 85) return { name: 'Legendary', color: 'from-yellow-500 to-orange-500' };
    if (rating >= 70) return { name: 'Epic', color: 'from-purple-500 to-pink-500' };
    if (rating >= 50) return { name: 'Rare', color: 'from-blue-500 to-cyan-500' };
    return { name: 'Common', color: 'from-gray-500 to-gray-600' };
  };
  
  const avgRating = getTotalRating();
  const rarity = getRarityFromRating(avgRating);
  
  return (
    <div className="relative z-10">
      <ParticlesBackground />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Create Player NFT</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-gray-800/70 backdrop-blur-md rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Player Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Player Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={playerData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter player name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Position
                </label>
                <select
                  name="position"
                  value={playerData.position}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Position</option>
                  {positions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
              </div>
              
              <h3 className="text-lg font-medium text-white mt-6 mb-3">Player Attributes</h3>
              
              {statsToDisplay.map(stat => (
                <div key={stat.key}>
                  <div className="flex justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-300">
                      {stat.label}
                    </label>
                    <span className="text-sm text-indigo-400">{playerData[stat.key]}</span>
                  </div>
                  <input
                    type="range"
                    name={stat.key}
                    min="0"
                    max="100"
                    value={playerData[stat.key]}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
              
              <div className="mt-8">
                <button
                  onClick={mintNFT}
                  disabled={isCreating || !publicKey || !playerData.name || !playerData.position}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  {isCreating ? 'Creating NFT...' : 'Create Player NFT'}
                </button>
                
                {message && (
                  <div className={`mt-4 p-3 rounded-lg ${success ? 'bg-green-800/50 text-green-200' : 'bg-red-800/50 text-red-200'}`}>
                    {message}
                    {mintAddress && (
                      <div className="mt-2">
                        <a 
                          href={getExplorerUrl(mintAddress)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:underline"
                        >
                          View on Solana Explorer
                        </a>
                      </div>
                    )}
                  </div>
                )}
                
                {!publicKey && (
                  <p className="mt-4 text-center text-yellow-400">
                    Please connect your wallet to mint NFTs
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Preview Section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">NFT Preview</h2>
            
            <div className="bg-gray-800/70 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <div className={`bg-gradient-to-br ${rarity.color} p-1 rounded-lg`}>
                <div className="bg-gray-900 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-white text-xl">
                      {playerData.name || 'Player Name'}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-black bg-opacity-30">
                      {rarity.name}
                    </span>
                  </div>
                  
                  <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Player NFT Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <span className="text-7xl">👤</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-gray-400 text-sm mb-1">
                      <span>Position:</span>
                      <span className="text-white">{playerData.position || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-sm">
                      <span>Overall Rating:</span>
                      <span className="text-white font-bold">{avgRating}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-black bg-opacity-30 rounded p-2 text-center">
                      <span className="text-xs text-gray-400">Mechanical</span>
                      <p className="text-white font-bold">{playerData.mechanical}</p>
                    </div>
                    <div className="bg-black bg-opacity-30 rounded p-2 text-center">
                      <span className="text-xs text-gray-400">Knowledge</span>
                      <p className="text-white font-bold">{playerData.gameKnowledge}</p>
                    </div>
                    <div className="bg-black bg-opacity-30 rounded p-2 text-center">
                      <span className="text-xs text-gray-400">Team Comm</span>
                      <p className="text-white font-bold">{playerData.teamCommunication}</p>
                    </div>
                  </div>
                  
                  <div className="bg-black bg-opacity-30 rounded-lg p-3 mb-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="text-gray-400">Adaptability:</div>
                      <div className="text-white text-right">{playerData.adaptability}</div>
                      
                      <div className="text-gray-400">Consistency:</div>
                      <div className="text-white text-right">{playerData.consistency}</div>
                      
                      <div className="text-gray-400">Form:</div>
                      <div className="text-white text-right">{playerData.form}</div>
                      
                      <div className="text-gray-400">Potential:</div>
                      <div className="text-white text-right">{playerData.potential}</div>
                    </div>
                  </div>
                  
                  <div className="text-center text-indigo-400 font-bold">
                    {Math.floor(avgRating / 10)} PWR
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-800/70 backdrop-blur-md rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-3">Minting Information</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2">•</span>
                  <span>Your NFT will be minted on the Solana blockchain</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2">•</span>
                  <span>All player attributes will be stored as NFT metadata</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2">•</span>
                  <span>You'll need to approve the transaction in your wallet</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2">•</span>
                  <span>Minting requires a small amount of SOL for the transaction fee</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2">•</span>
                  <span>The higher the attributes, the rarer the player card</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mint;