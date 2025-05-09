// src/App.jsx
import { useMemo, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  useConnection
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletMultiButton
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { initializeUmi, createPlayerNFT, getExplorerUrl } from "./utils/nftUtils";

// Simple NFT Minting component
const MintNFT = () => {
  const { publicKey } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();
  
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [mintAddress, setMintAddress] = useState(null);
  
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
      setMessage('Creating player NFT. Please approve the transaction in your wallet...');
      setSuccess(false);
      
      console.log("Initializing Umi with wallet and connection");
      // Initialize Umi
      const umi = initializeUmi(connection, wallet);
      
      console.log("Creating NFT");
      // Create the NFT
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
  
  const positions = ['Midlaner', 'Toplaner', 'ADC', 'Support', 'Jungler'];
  
  // Calculate player rating and rarity
  const getTotalRating = () => {
    const total = Object.entries(playerData)
      .filter(([key, _]) => ['mechanical', 'gameKnowledge', 'teamCommunication', 'adaptability', 'consistency', 'form', 'potential'].includes(key))
      .reduce((sum, [_, value]) => sum + parseInt(value), 0);
    
    const count = 7; // Number of stat attributes
    return Math.floor(total / count);
  };
  
  const getRarityFromRating = (rating) => {
    if (rating >= 85) return { name: 'Legendary', color: 'from-yellow-500 to-orange-500' };
    if (rating >= 70) return { name: 'Epic', color: 'from-purple-500 to-pink-500' };
    if (rating >= 50) return { name: 'Rare', color: 'from-blue-500 to-cyan-500' };
    return { name: 'Common', color: 'from-gray-500 to-gray-600' };
  };
  
  const avgRating = getTotalRating();
  const rarity = getRarityFromRating(avgRating);
  
  const statsToDisplay = [
    { key: 'mechanical', label: 'Mechanical' },
    { key: 'gameKnowledge', label: 'Game Knowledge' },
    { key: 'teamCommunication', label: 'Team Communication' },
    { key: 'adaptability', label: 'Adaptability' },
    { key: 'consistency', label: 'Consistency' },
    { key: 'form', label: 'Form' },
    { key: 'potential', label: 'Potential' },
  ];
  
  return (
    <div className="max-w-6xl mx-auto my-8 p-6">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Create Player NFT</h2>
      <p className="text-gray-300 mb-6 text-center">
        Create player NFTs for the 5VS5dotGG platform on Solana devnet.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Player Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Player Name</label>
              <input 
                type="text" 
                name="name"
                value={playerData.name}
                onChange={handleInputChange}
                placeholder="Player Name" 
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Position</label>
              <select 
                name="position"
                value={playerData.position}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
              >
                <option value="">Select Position</option>
                {positions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>
            
            <h4 className="text-lg font-semibold text-white mt-4 mb-2">Player Attributes</h4>
            
            {statsToDisplay.map(stat => (
              <div key={stat.key}>
                <div className="flex justify-between mb-1">
                  <label className="block text-gray-300">
                    {stat.label}
                  </label>
                  <span className="text-indigo-400">{playerData[stat.key]}</span>
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
            
            <button 
              onClick={mintNFT} 
              disabled={isCreating || !publicKey || !playerData.name || !playerData.position}
              className="w-full mt-4 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating NFT...' : 'Mint NFT on Devnet'}
            </button>
            
            {message && (
              <div className={`p-3 mt-4 rounded-lg ${success ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                {message}
                {mintAddress && (
                  <div className="mt-2">
                    <a 
                      href={getExplorerUrl(mintAddress)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:underline"
                    >
                      View on Solana Explorer (Devnet)
                    </a>
                  </div>
                )}
              </div>
            )}
            
            {!publicKey && (
              <div className="mt-4 p-3 bg-blue-900/50 text-blue-200 rounded-lg">
                <p className="text-center">
                  Please connect your wallet to mint NFTs
                </p>
                <p className="text-xs text-center mt-1 text-blue-300">
                  Make sure your wallet is set to Solana devnet
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Preview Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">NFT Preview</h2>
          
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
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
                
                <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                  <span className="text-7xl">👤</span>
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
          
          <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-3">Minting Information</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">•</span>
                <span>Your NFT will be minted on the <span className="text-blue-300">Solana devnet</span> blockchain</span>
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
              <li className="flex items-start">
                <span className="text-indigo-400 mr-2">•</span>
                <span>You might need <a href="https://solfaucet.com/" target="_blank" rel="noreferrer" className="text-blue-300 underline">devnet SOL</a> for transaction fees</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wallet Context Provider Component
const WalletContextProvider = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = "https://api.devnet.solana.com";

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network })
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

function App() {
  return (
    <WalletContextProvider>
      <div className="min-h-screen flex flex-col bg-gray-900">
        <header className="p-4 bg-gray-800 border-b border-gray-700">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-white text-xl font-bold">5VS5dotGG</h1>
              <span className="ml-2 px-2 py-0.5 bg-blue-600 text-xs font-semibold rounded-md text-white">DEVNET</span>
            </div>
            <WalletMultiButton />
          </div>
        </header>
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <MintNFT />
        </main>
        
        <footer className="py-4 border-t border-gray-800 bg-gray-900">
          <div className="container mx-auto px-4 text-center text-gray-400">
            © 2024 5VS5dotGG - Decentralized Esports Platform | Operating on <span className="text-blue-400">Solana Devnet</span>
          </div>
        </footer>
      </div>
    </WalletContextProvider>
  );
}

export default App;