import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PlayerCard from '../../../components/PlayerCard';
import Button from '../../../components/ui/Button';

const PlayerNFT = () => {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Simulated NFT data - replace with actual API call
  useEffect(() => {
    // Simulate API loading delay
    const fetchNFTs = async () => {
      setIsLoading(true);
      try {
        // First, check localStorage for already owned NFTs
        const ownedNFTs = JSON.parse(localStorage.getItem('playerOwnedNFTs') || '[]');
        
        // If no NFTs found in localStorage, use mock data
        if (ownedNFTs.length === 0) {
          // Simulated data for demonstration
          const mockData = [
            {
              id: '1',
              name: 'Cyber Samurai',
              image: 'https://via.placeholder.com/300x300?text=Cyber+Samurai',
              tokenId: '1337',
              collectionName: 'CryptoWarriors',
              attributes: [
                { trait_type: 'Strength', value: '90' },
                { trait_type: 'Speed', value: '75' },
                { trait_type: 'Magic', value: '80' },
                { trait_type: 'Durability', value: '95' }
              ],
              stats: {
                attack: 85,
                defense: 90,
                speed: 75,
                health: 800,
                mana: 650
              }
            },
            {
              id: '2',
              name: 'Mystic Dragon',
              image: 'https://via.placeholder.com/300x300?text=Mystic+Dragon',
              tokenId: '420',
              collectionName: 'FantasyBeasts',
              attributes: [
                { trait_type: 'Fire', value: '100' },
                { trait_type: 'Flight', value: '85' },
                { trait_type: 'Wisdom', value: '90' }
              ],
              stats: {
                attack: 92,
                defense: 70,
                speed: 88,
                health: 750,
                mana: 900
              }
            },
            {
              id: '3',
              name: 'Space Pirate',
              image: 'https://via.placeholder.com/300x300?text=Space+Pirate',
              tokenId: '777',
              collectionName: 'GalacticOutlaws',
              attributes: [
                { trait_type: 'Charisma', value: '95' },
                { trait_type: 'Piloting', value: '85' },
                { trait_type: 'Combat', value: '75' }
              ],
              stats: {
                attack: 78,
                defense: 65,
                speed: 95,
                health: 600,
                mana: 550
              }
            },
            {
              id: '4',
              name: 'Quantum Knight',
              image: 'https://via.placeholder.com/300x300?text=Quantum+Knight',
              tokenId: '101',
              collectionName: 'FutureFighters',
              attributes: [
                { trait_type: 'Intelligence', value: '90' },
                { trait_type: 'Armor', value: '95' },
                { trait_type: 'Technology', value: '100' }
              ],
              stats: {
                attack: 75,
                defense: 95,
                speed: 60,
                health: 950,
                mana: 700
              }
            },
            {
              id: '5',
              name: 'Ancient Guardian',
              image: 'https://via.placeholder.com/300x300?text=Ancient+Guardian',
              tokenId: '007',
              collectionName: 'TimelessProtectors',
              attributes: [
                { trait_type: 'Defense', value: '100' },
                { trait_type: 'Wisdom', value: '95' },
                { trait_type: 'Longevity', value: '100' }
              ],
              stats: {
                attack: 70,
                defense: 100,
                speed: 40,
                health: 1200,
                mana: 800
              }
            },
            {
              id: '6',
              name: 'Neon Assassin',
              image: 'https://via.placeholder.com/300x300?text=Neon+Assassin',
              tokenId: '256',
              collectionName: 'DigitalMercenaries',
              attributes: [
                { trait_type: 'Stealth', value: '95' },
                { trait_type: 'Agility', value: '90' },
                { trait_type: 'Hacking', value: '85' }
              ],
              stats: {
                attack: 82,
                defense: 45,
                speed: 98,
                health: 500,
                mana: 600
              }
            }
          ];
          
          // Save to localStorage for future use
          localStorage.setItem('playerOwnedNFTs', JSON.stringify(mockData));
          setNfts(mockData);
        } else {
          // Use NFTs from localStorage
          setNfts(ownedNFTs);
        }

        // Simulate network delay
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  // Filter NFTs based on searchQuery
  const filteredNFTs = nfts.filter(nft => {
    // Filter by search query
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.collectionName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">My NFT Collection</h1>
          <Link to="/player/playernft/buy">
            <Button>
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                  />
                </svg>
                Buy NFT
              </span>
            </Button>
          </Link>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search NFTs..."
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
                <p className="text-gray-400 mb-6">
                  {searchQuery 
                    ? `No NFTs match your search for "${searchQuery}".` 
                    : `You don't have any ${activeFilter !== 'all' ? activeFilter : ''} NFTs yet.`
                  }
                </p>
                <Link to="/player/playernft/buy">
                  <Button>
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                        />
                      </svg>
                      Browse NFT Marketplace
                    </span>
                  </Button>
                </Link>
              </div>
            ) : (
              /* NFT Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredNFTs.map(nft => (
                  <PlayerCard key={nft.id} {...nft} />
                ))}
              </div>
            )}
            
            {/* Total Count */}
            {filteredNFTs.length > 0 && (
              <p className="text-gray-400 mt-6">
                Showing {filteredNFTs.length} of {nfts.length} NFTs
              </p>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PlayerNFT;