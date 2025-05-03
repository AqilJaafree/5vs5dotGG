import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const NFTBuy = () => {
  const navigate = useNavigate();
  const [marketplaceNFTs, setMarketplaceNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [balance, setBalance] = useState(5000); // Mock player balance
  
  // Mock marketplace NFTs
  useEffect(() => {
    const fetchMarketplaceNFTs = async () => {
      setIsLoading(true);
      
      try {
        // Check for player balance in localStorage
        const storedBalance = localStorage.getItem('playerBalance');
        if (storedBalance) {
          setBalance(parseInt(storedBalance));
        } else {
          // Save initial balance if not set
          localStorage.setItem('playerBalance', balance.toString());
        }
        
        // In a real app, this would be an API call to get marketplace NFTs
        // Mock data for marketplace
        const mockMarketplaceData = [
          {
            id: 'm1',
            name: 'Flux Voyager',
            image: 'https://via.placeholder.com/300x300?text=Flux+Voyager',
            tokenId: '2398',
            collectionName: 'TimeTravelers',
            price: 850,
            creator: 'TimeFlux Studios',
            attributes: [
              { trait_type: 'Time Control', value: '88' },
              { trait_type: 'Speed', value: '92' },
              { trait_type: 'Intelligence', value: '76' }
            ],
            stats: {
              attack: 78,
              defense: 65,
              speed: 92,
              health: 700,
              mana: 850
            }
          },
          {
            id: 'm2',
            name: 'Void Walker',
            image: 'https://via.placeholder.com/300x300?text=Void+Walker',
            tokenId: '413',
            collectionName: 'CosmicVoyagers',
            price: 1200,
            creator: 'Nebula Arts',
            attributes: [
              { trait_type: 'Stealth', value: '94' },
              { trait_type: 'Dark Energy', value: '88' },
              { trait_type: 'Teleportation', value: '91' }
            ],
            stats: {
              attack: 85,
              defense: 75,
              speed: 94,
              health: 750,
              mana: 900
            }
          },
          {
            id: 'm3',
            name: 'Electro Ninja',
            image: 'https://via.placeholder.com/300x300?text=Electro+Ninja',
            tokenId: '755',
            collectionName: 'CyberShinobi',
            price: 650,
            creator: 'NeoCyber Labs',
            attributes: [
              { trait_type: 'Agility', value: '92' },
              { trait_type: 'Lightning', value: '87' },
              { trait_type: 'Stealth', value: '85' }
            ],
            stats: {
              attack: 87,
              defense: 62,
              speed: 92,
              health: 600,
              mana: 750
            }
          },
          {
            id: 'm4',
            name: 'Frost Giant',
            image: 'https://via.placeholder.com/300x300?text=Frost+Giant',
            tokenId: '142',
            collectionName: 'NordicLegends',
            price: 900,
            creator: 'Viking Games',
            attributes: [
              { trait_type: 'Strength', value: '95' },
              { trait_type: 'Ice Magic', value: '86' },
              { trait_type: 'Resistance', value: '90' }
            ],
            stats: {
              attack: 95,
              defense: 85,
              speed: 45,
              health: 1100,
              mana: 700
            }
          },
          {
            id: 'm5',
            name: 'Desert Nomad',
            image: 'https://via.placeholder.com/300x300?text=Desert+Nomad',
            tokenId: '329',
            collectionName: 'SandWalkers',
            price: 400,
            creator: 'Dune Studios',
            attributes: [
              { trait_type: 'Survival', value: '93' },
              { trait_type: 'Navigation', value: '87' },
              { trait_type: 'Endurance', value: '85' }
            ],
            stats: {
              attack: 65,
              defense: 70,
              speed: 75,
              health: 800,
              mana: 550
            }
          },
          {
            id: 'm6',
            name: 'Celestial Guardian',
            image: 'https://via.placeholder.com/300x300?text=Celestial+Guardian',
            tokenId: '011',
            collectionName: 'StarKeepers',
            price: 1500,
            creator: 'Cosmic Arts',
            attributes: [
              { trait_type: 'Light Magic', value: '98' },
              { trait_type: 'Wisdom', value: '95' },
              { trait_type: 'Protection', value: '96' }
            ],
            stats: {
              attack: 88,
              defense: 95,
              speed: 75,
              health: 1000,
              mana: 1200
            }
          },
          {
            id: 'm7',
            name: 'Shadow Assassin',
            image: 'https://via.placeholder.com/300x300?text=Shadow+Assassin',
            tokenId: '667',
            collectionName: 'NightStalkers',
            price: 950,
            creator: 'Umbra Games',
            attributes: [
              { trait_type: 'Stealth', value: '97' },
              { trait_type: 'Precision', value: '93' },
              { trait_type: 'Speed', value: '90' }
            ],
            stats: {
              attack: 92,
              defense: 55,
              speed: 96,
              health: 550,
              mana: 700
            }
          },
          {
            id: 'm8',
            name: 'Terra Shaman',
            image: 'https://via.placeholder.com/300x300?text=Terra+Shaman',
            tokenId: '489',
            collectionName: 'EarthKeepers',
            price: 725,
            creator: 'Gaia Collective',
            attributes: [
              { trait_type: 'Earth Magic', value: '92' },
              { trait_type: 'Healing', value: '88' },
              { trait_type: 'Wisdom', value: '85' }
            ],
            stats: {
              attack: 75,
              defense: 85,
              speed: 65,
              health: 950,
              mana: 900
            }
          }
        ];
        
        // Check if we have a marketplace in localStorage
        const storedMarketplace = JSON.parse(localStorage.getItem('nftMarketplace') || '[]');
        
        // If no marketplace data in localStorage, use mock data
        if (storedMarketplace.length === 0) {
          localStorage.setItem('nftMarketplace', JSON.stringify(mockMarketplaceData));
          setMarketplaceNFTs(mockMarketplaceData);
        } else {
          setMarketplaceNFTs(storedMarketplace);
        }
        
        // Simulate network delay
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching marketplace NFTs:", error);
        setIsLoading(false);
      }
    };
    
    fetchMarketplaceNFTs();
  }, []);
  
  // Filter NFTs based on selectedFilter and searchQuery
  const filteredNFTs = marketplaceNFTs.filter(nft => {
    // Filter by rarity if selected filter is not 'all'
    const passesRarityFilter = selectedFilter === 'all' || 
                              (nft.rarity && nft.rarity.toLowerCase() === selectedFilter.toLowerCase());
    
    // Filter by search query
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          nft.collectionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          nft.creator.toLowerCase().includes(searchQuery.toLowerCase());
    
    return passesRarityFilter && matchesSearch;
  });
  
  // Sort NFTs by price (lowest to highest by default)
  const sortedNFTs = [...filteredNFTs].sort((a, b) => a.price - b.price);
  
  // Handle NFT purchase
  const handlePurchase = (nft) => {
    setSelectedNFT(nft);
    setPurchasing(true);
  };
  
  // Confirm purchase
  const confirmPurchase = () => {
    // Check if player has enough balance
    if (balance < selectedNFT.price) {
      alert("Insufficient balance to purchase this NFT.");
      setPurchasing(false);
      return;
    }
    
    try {
      // Deduct from balance
      const newBalance = balance - selectedNFT.price;
      setBalance(newBalance);
      
      // Add NFT to player's collection in localStorage
      const ownedNFTs = JSON.parse(localStorage.getItem('playerOwnedNFTs') || '[]');
      
      // Convert marketplace NFT to owned NFT format
      const ownedNFT = {
        id: selectedNFT.id,
        name: selectedNFT.name,
        image: selectedNFT.image,
        rarity: selectedNFT.rarity,
        tokenId: selectedNFT.tokenId,
        collectionName: selectedNFT.collectionName,
        attributes: selectedNFT.attributes,
        stats: selectedNFT.stats,
        purchasedAt: new Date().toISOString(),
        purchasePrice: selectedNFT.price
      };
      
      // Add to owned NFTs
      ownedNFTs.push(ownedNFT);
      
      // Save to localStorage
      localStorage.setItem('playerOwnedNFTs', JSON.stringify(ownedNFTs));
      
      // Save updated balance
      localStorage.setItem('playerBalance', newBalance.toString());
      
      // Remove NFT from marketplace
      const updatedMarketplace = marketplaceNFTs.filter(nft => nft.id !== selectedNFT.id);
      setMarketplaceNFTs(updatedMarketplace);
      
      // Update marketplace in localStorage
      localStorage.setItem('nftMarketplace', JSON.stringify(updatedMarketplace));
      
      // Show success message and reset
      alert(`Successfully purchased ${selectedNFT.name}!`);
      setPurchasing(false);
      
      // Optionally, navigate back to collection
      // navigate('/player/nft');
    } catch (error) {
      console.error("Error purchasing NFT:", error);
      alert("Error purchasing NFT. Please try again.");
      setPurchasing(false);
    }
  };
  
  // Cancel purchase
  const cancelPurchase = () => {
    setPurchasing(false);
    setSelectedNFT(null);
  };
  
  // Available rarities for filter
  const rarities = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
  
  // Get background color based on rarity
  const getRarityColor = (rarity) => {
    switch(rarity?.toLowerCase()) {
      case 'common':
        return 'from-gray-700 to-gray-900';
      case 'uncommon':
        return 'from-green-700 to-green-900';
      case 'rare':
        return 'from-blue-700 to-blue-900';
      case 'epic':
        return 'from-purple-700 to-purple-900';
      case 'legendary':
        return 'from-orange-700 to-orange-900';
      case 'mythic':
        return 'from-red-700 to-red-900';
      default:
        return 'from-gray-700 to-gray-900';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <Link to="/player/playernft" className="text-blue-400 flex items-center mb-2">
              <svg 
                className="w-5 h-5 mr-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
              Back to Collection
            </Link>
            <h1 className="text-3xl font-bold text-white">NFT Marketplace</h1>
          </div>
          <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-lg px-4 py-2">
            <p className="text-white">
              Balance: <span className="font-bold text-green-400">{balance} ₮</span>
            </p>
          </div>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search marketplace..."
              className="w-full bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg 
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <svg 
              className="animate-spin h-10 w-10 text-purple-500" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : (
          <>
            {/* Empty State */}
            {filteredNFTs.length === 0 ? (
              <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-8 text-center">
                <svg 
                  className="h-16 w-16 text-gray-500 mx-auto mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                  />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">No NFTs Found</h3>
                <p className="text-gray-400">
                  {searchQuery 
                    ? `No NFTs match your search for "${searchQuery}".` 
                    : `No ${selectedFilter !== 'all' ? selectedFilter : ''} NFTs are available in the marketplace right now.`
                  }
                </p>
              </div>
            ) : (
              /* NFT Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedNFTs.map(nft => (
                  <motion.div
                    key={nft.id}
                    className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden shadow-xl"
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <img 
                        src={nft.image} 
                        alt={nft.name}
                        className="w-full h-48 object-cover"
                      />
                      
                      {/* Rarity Badge */}
                      <div className={`absolute top-2 right-2 bg-gradient-to-r ${getRarityColor(nft.rarity)} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                        {nft.rarity}
                      </div>
                      
                      {/* Price Tag */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm font-bold px-3 py-1 rounded-lg">
                        {nft.price} ₮
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h2 className="text-xl font-bold text-white mb-1 truncate">{nft.name}</h2>
                      <p className="text-gray-400 text-sm mb-1 truncate">{nft.collectionName} #{nft.tokenId}</p>
                      <p className="text-gray-400 text-xs mb-3">By {nft.creator}</p>
                      
                      {/* Stats Preview */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-gray-800 rounded-md p-1 text-center">
                          <p className="text-red-400 text-xs">ATK</p>
                          <p className="text-white text-sm font-medium">{nft.stats.attack}</p>
                        </div>
                        <div className="bg-gray-800 rounded-md p-1 text-center">
                          <p className="text-blue-400 text-xs">DEF</p>
                          <p className="text-white text-sm font-medium">{nft.stats.defense}</p>
                        </div>
                        <div className="bg-gray-800 rounded-md p-1 text-center">
                          <p className="text-green-400 text-xs">SPD</p>
                          <p className="text-white text-sm font-medium">{nft.stats.speed}</p>
                        </div>
                      </div>
                      
                      <Button
                        className="w-full"
                        onClick={() => handlePurchase(nft)}
                        disabled={balance < nft.price}
                      >
                        {balance < nft.price ? (
                          <span className="flex items-center">
                            <svg 
                              className="w-5 h-5 mr-2" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                              />
                            </svg>
                            Insufficient Funds
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <svg 
                              className="w-5 h-5 mr-2" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24" 
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                              />
                            </svg>
                            Buy Now
                          </span>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Total Count */}
            {filteredNFTs.length > 0 && (
              <p className="text-gray-400 mt-6">
                Showing {filteredNFTs.length} of {marketplaceNFTs.length} NFTs
              </p>
            )}
          </>
        )}
      </motion.div>
      
      {/* Purchase Confirmation Modal */}
      {purchasing && selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <motion.div
            className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Confirm Purchase</h2>
            
            <div className="flex items-start mb-6">
              <img 
                src={selectedNFT.image} 
                alt={selectedNFT.name}
                className="w-24 h-24 object-cover rounded-lg mr-4"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{selectedNFT.name}</h3>
                <p className="text-gray-400 text-sm">{selectedNFT.collectionName} #{selectedNFT.tokenId}</p>
                <p className="text-gray-400 text-sm">Created by {selectedNFT.creator}</p>
                <p className="text-white font-bold mt-2">Price: {selectedNFT.price} ₮</p>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3 mb-6">
              <p className="text-gray-300 mb-1">Your balance after purchase:</p>
              <p className="text-green-400 font-bold text-lg">{balance - selectedNFT.price} ₮</p>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={cancelPurchase}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={confirmPurchase}
              >
                Confirm Purchase
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default NFTBuy;