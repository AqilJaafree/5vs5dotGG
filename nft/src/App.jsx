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
      setMessage('Creating player NFT. Please approve the transaction...');
      setSuccess(false);
      
      // Initialize Umi
      const umi = initializeUmi(connection, wallet);
      
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
  
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Mint Player NFT</h2>
      <p className="text-gray-300 mb-6">
        Create player NFTs for the 5VS5dotGG platform.
      </p>
      
      <div className="flex flex-col space-y-4">
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
        
        <div>
          <label className="block text-gray-300 mb-1">
            Mechanical Skill: {playerData.mechanical}
          </label>
          <input
            type="range"
            name="mechanical"
            min="0"
            max="100" 
            value={playerData.mechanical}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-1">
            Game Knowledge: {playerData.gameKnowledge}
          </label>
          <input
            type="range"
            name="gameKnowledge"
            min="0"
            max="100" 
            value={playerData.gameKnowledge}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-1">
            Team Communication: {playerData.teamCommunication}
          </label>
          <input
            type="range"
            name="teamCommunication"
            min="0"
            max="100" 
            value={playerData.teamCommunication}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
        
        <button 
          onClick={mintNFT} 
          disabled={isCreating || !publicKey || !playerData.name || !playerData.position}
          className="p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? 'Creating NFT...' : 'Mint NFT'}
        </button>
        
        {message && (
          <div className={`p-3 rounded-lg ${success ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
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
          <p className="text-center text-yellow-400">
            Please connect your wallet to mint NFTs
          </p>
        )}
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
            <h1 className="text-white text-xl font-bold">5VS5dotGG</h1>
            <WalletMultiButton />
          </div>
        </header>
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <MintNFT />
        </main>
        
        <footer className="py-4 border-t border-gray-800 bg-gray-900">
          <div className="container mx-auto px-4 text-center text-gray-400">
            © 2024 5VS5dotGG - Decentralized Esports Platform
          </div>
        </footer>
      </div>
    </WalletContextProvider>
  );
}

export default App;