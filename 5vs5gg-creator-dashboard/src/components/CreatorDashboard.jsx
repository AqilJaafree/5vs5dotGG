// src/components/CreatorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const CreatorDashboard = () => {
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [totalStaked, setTotalStaked] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);
  const [creatorNfts, setCreatorNfts] = useState([]);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  
  // Form state
  const [nftName, setNftName] = useState('');
  const [description, setDescription] = useState('');
  const [creditCost, setCreditCost] = useState(100);
  const [totalAvailable, setTotalAvailable] = useState(100);
  const [imageUrl, setImageUrl] = useState('');
  const [mechanical, setMechanical] = useState(85);
  const [gameKnowledge, setGameKnowledge] = useState(80);
  const [teamCommunication, setTeamCommunication] = useState(75);

  // Mock NFT data for demonstration
  const mockNfts = [
    {
      id: 1,
      name: 'Pro Midlaner #1',
      image: 'https://via.placeholder.com/150?text=NFT1',
      createdAt: new Date().toLocaleDateString(),
      claimed: 5,
      creditCost: 100,
      totalAvailable: 100
    },
    {
      id: 2,
      name: 'Top Jungler #3',
      image: 'https://via.placeholder.com/150?text=NFT2', 
      createdAt: new Date().toLocaleDateString(),
      claimed: 2,
      creditCost: 150,
      totalAvailable: 50
    },
    {
      id: 3,
      name: 'Support Master #7',
      image: 'https://via.placeholder.com/150?text=NFT3',
      createdAt: new Date().toLocaleDateString(),
      claimed: 0,
      creditCost: 200,
      totalAvailable: 25
    }
  ];

  // Load creator NFTs and stats
  useEffect(() => {
    if (connected && publicKey) {
      loadCreatorData();
    }
  }, [connected, publicKey]);

  const loadCreatorData = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would:
      // 1. Query the chain for NFTs created by this address
      // 2. Get staking pool data to calculate rewards
      // Here we're using mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCreatorNfts(mockNfts);
      setTotalStaked(1250.75);
      setTotalRewards(97.25);
    } catch (error) {
      console.error('Error loading creator data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewNft = async () => {
    setLoading(true);
    
    try {
      // In a real implementation, you would:
      // 1. Upload NFT metadata to Arweave
      // 2. Mint a new NFT using Metaplex
      // 3. Configure credit costs
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('NFT created successfully!');
      loadCreatorData(); // Refresh data
      
      // Reset form
      setNftName('');
      setDescription('');
      setCreditCost(100);
      setTotalAvailable(100);
      setImageUrl('');
      setMechanical(85);
      setGameKnowledge(80);
      setTeamCommunication(75);
    } catch (error) {
      console.error('Error creating NFT:', error);
      alert('Error creating NFT. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render different content based on selected tab
  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return renderDashboard();
      case 'nfts':
        return renderNFTs();
      case 'create':
        return renderCreateNFT();
      default:
        return renderDashboard();
    }
  };

  // Dashboard tab content
  const renderDashboard = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Creator Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-900 bg-opacity-20 p-6 rounded-lg border border-blue-500">
          <h3 className="text-lg font-medium text-blue-400 mb-2">Total SOL Staked</h3>
          <p className="text-3xl font-bold">{totalStaked} SOL</p>
          <p className="text-sm text-gray-400 mt-2">From all players using your NFTs</p>
        </div>
        
        <div className="bg-green-900 bg-opacity-20 p-6 rounded-lg border border-green-500">
          <h3 className="text-lg font-medium text-green-400 mb-2">Creator Rewards</h3>
          <p className="text-3xl font-bold">{totalRewards} SOL</p>
          <p className="text-sm text-gray-400 mt-2">Earnings from staking rewards</p>
        </div>
      </div>
      
      <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
        <h3 className="text-xl font-medium mb-4">NFT Performance</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 rounded-lg">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left">NFT</th>
                <th className="py-3 px-4 text-left">Claimed</th>
                <th className="py-3 px-4 text-left">Available</th>
                <th className="py-3 px-4 text-left">Credit Cost</th>
              </tr>
            </thead>
            <tbody>
              {creatorNfts.map(nft => (
                <tr key={nft.id} className="border-t border-gray-800">
                  <td className="py-3 px-4 flex items-center">
                    <img src={nft.image} alt={nft.name} className="w-10 h-10 rounded mr-3" />
                    <span>{nft.name}</span>
                  </td>
                  <td className="py-3 px-4">{nft.claimed}</td>
                  <td className="py-3 px-4">{nft.totalAvailable - nft.claimed}</td>
                  <td className="py-3 px-4">{nft.creditCost} credits</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // NFTs tab content
  const renderNFTs = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Your NFTs</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creatorNfts.map(nft => (
          <div key={nft.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover" />
            
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{nft.name}</h3>
              <p className="text-sm text-gray-400 mb-3">Created: {nft.createdAt}</p>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-gray-700 p-2 rounded">
                  <span className="block text-xs text-gray-400">Claimed</span>
                  <span className="font-bold">{nft.claimed}/{nft.totalAvailable}</span>
                </div>
                <div className="bg-gray-700 p-2 rounded">
                  <span className="block text-xs text-gray-400">Credit Cost</span>
                  <span className="font-bold">{nft.creditCost}</span>
                </div>
              </div>
              
              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
                onClick={() => alert("Edit functionality would go here")}
              >
                Edit NFT
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Create NFT tab content
  const renderCreateNFT = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Create New NFT</h2>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="nftName">
            NFT Name
          </label>
          <input
            type="text"
            id="nftName"
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter NFT name"
            value={nftName}
            onChange={(e) => setNftName(e.// src/components/CreatorDashboard.jsx (continued)
                target.value)}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your NFT"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="creditCost">
                  Credit Cost
                </label>
                <input
                  type="number"
                  id="creditCost"
                  min="1"
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100"
                  value={creditCost}
                  onChange={(e) => setCreditCost(parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="totalAvailable">
                  Total Available
                </label>
                <input
                  type="number"
                  id="totalAvailable"
                  min="1"
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100"
                  value={totalAvailable}
                  onChange={(e) => setTotalAvailable(parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-300 mb-2" htmlFor="imageUrl">
                Image URL (or upload)
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="imageUrl"
                  className="flex-1 bg-gray-700 text-white rounded-l-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.png"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-r-lg"
                  onClick={() => alert("Upload functionality would go here")}
                >
                  Upload
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-4">Player Attributes</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="mechanical">
                  Mechanical Skill (0-100)
                </label>
                <input
                  type="number"
                  id="mechanical"
                  min="0"
                  max="100"
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="85"
                  value={mechanical}
                  onChange={(e) => setMechanical(parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="gameKnowledge">
                  Game Knowledge (0-100)
                </label>
                <input
                  type="number"
                  id="gameKnowledge"
                  min="0"
                  max="100"
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="80"
                  value={gameKnowledge}
                  onChange={(e) => setGameKnowledge(parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="teamCommunication">
                  Team Communication (0-100)
                </label>
                <input
                  type="number"
                  id="teamCommunication"
                  min="0"
                  max="100"
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="75"
                  value={teamCommunication}
                  onChange={(e) => setTeamCommunication(parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium"
                disabled={loading}
                onClick={createNewNft}
              >
                {loading ? 'Creating...' : 'Create NFT'}
              </button>
            </div>
          </div>
        </div>
      );
    
      // Wallet not connected view
      const renderWalletNotConnected = () => (
        <div className="p-4 flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Connect your wallet to access the Creator Dashboard</h2>
          <div className="mb-8">
            <WalletMultiButton />
          </div>
          <p className="text-gray-400 text-center max-w-md">
            Connect your wallet to create NFTs, track staking rewards, and manage your creator profile.
          </p>
        </div>
      );
    
      return (
        <div className="min-h-screen bg-gray-900 text-white">
          {/* Header */}
          <header className="bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold mr-8">5VS5.GG Creators</h1>
                
                {connected && (
                  <nav className="hidden md:flex space-x-4">
                    <button 
                      onClick={() => setSelectedTab('dashboard')} 
                      className={`px-3 py-2 rounded ${selectedTab === 'dashboard' ? 'bg-blue-800' : 'hover:bg-gray-700'}`}
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => setSelectedTab('nfts')} 
                      className={`px-3 py-2 rounded ${selectedTab === 'nfts' ? 'bg-blue-800' : 'hover:bg-gray-700'}`}
                    >
                      Your NFTs
                    </button>
                    <button 
                      onClick={() => setSelectedTab('create')} 
                      className={`px-3 py-2 rounded ${selectedTab === 'create' ? 'bg-blue-800' : 'hover:bg-gray-700'}`}
                    >
                      Create NFT
                    </button>
                  </nav>
                )}
              </div>
              
              <WalletMultiButton />
            </div>
          </header>
          
          {/* Mobile Navigation */}
          {connected && (
            <div className="md:hidden bg-gray-800 border-t border-gray-700">
              <div className="container mx-auto px-4 py-2 flex justify-between">
                <button 
                  onClick={() => setSelectedTab('dashboard')} 
                  className={`flex-1 px-2 py-1 text-center text-sm ${selectedTab === 'dashboard' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setSelectedTab('nfts')} 
                  className={`flex-1 px-2 py-1 text-center text-sm ${selectedTab === 'nfts' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                >
                  NFTs
                </button>
                <button 
                  onClick={() => setSelectedTab('create')} 
                  className={`flex-1 px-2 py-1 text-center text-sm ${selectedTab === 'create' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                >
                  Create
                </button>
              </div>
            </div>
          )}
          
          {/* Main Content */}
          <main className="container mx-auto">
            {connected ? renderContent() : renderWalletNotConnected()}
          </main>
        </div>
      );
    };
    
    export default CreatorDashboard;