import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';

const NFTDetail = () => {
  const { id } = useParams();
  const [nft, setNft] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNFTDetail = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        // const response = await fetch(`/api/nfts/${id}`);
        // const data = await response.json();
        
        // Simulated data for demonstration
        const mockNFTs = {
          '1': {
            id: '1',
            name: 'Cyber Samurai',
            image: 'https://via.placeholder.com/600x600?text=Cyber+Samurai',
            tokenId: '1337',
            collectionName: 'CryptoWarriors',
            description: 'A futuristic warrior equipped with cybernetic enhancements and ancient samurai training. Born from the digital realm, the Cyber Samurai represents the perfect fusion of tradition and technology.',
            creator: 'DigitalForge Studios',
            creationDate: '2025-02-15',
            blockchain: 'Ethereum',
            attributes: [
              { trait_type: 'Strength', value: '90' },
              { trait_type: 'Speed', value: '75' },
              { trait_type: 'Magic', value: '80' },
              { trait_type: 'Durability', value: '95' },
              { trait_type: 'Weapon Mastery', value: '92' },
              { trait_type: 'Tech Integration', value: '88' }
            ],
            history: [
              { event: 'Minted', date: '2025-02-15', price: '0.5 ETH' },
              { event: 'First Sale', date: '2025-03-01', price: '2.3 ETH' },
              { event: 'Acquired', date: '2025-04-10', price: '3.7 ETH' }
            ]
          },
          '2': {
            id: '2',
            name: 'Mystic Dragon',
            image: 'https://via.placeholder.com/600x600?text=Mystic+Dragon',
            tokenId: '420',
            collectionName: 'FantasyBeasts',
            description: 'An ancient dragon with scales that shimmer with arcane energy. The Mystic Dragon has the power to manipulate reality itself and has watched civilizations rise and fall for millennia.',
            creator: 'MythicArts Collective',
            creationDate: '2025-01-20',
            blockchain: 'Ethereum',
            attributes: [
              { trait_type: 'Fire', value: '100' },
              { trait_type: 'Flight', value: '85' },
              { trait_type: 'Wisdom', value: '90' },
              { trait_type: 'Magic Resistance', value: '95' },
              { trait_type: 'Age', value: '10,000 years' },
              { trait_type: 'Size', value: 'Colossal' }
            ],
            history: [
              { event: 'Minted', date: '2025-01-20', price: '1.0 ETH' },
              { event: 'First Sale', date: '2025-02-05', price: '5.8 ETH' },
              { event: 'Acquired', date: '2025-03-15', price: '8.2 ETH' }
            ]
          },
          // Add more mock NFT data as needed for other IDs
          // Make sure to include details for all NFTs in the PlayerNFT page
        };

        // Simulate network delay
        setTimeout(() => {
          const foundNFT = mockNFTs[id];
          if (foundNFT) {
            setNft(foundNFT);
          }
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching NFT details:", error);
        setIsLoading(false);
      }
    };

    fetchNFTDetail();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8">
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
      ) : nft ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          {/* Back Button */}
          <Link to="/player/playernft" className="inline-flex items-center text-blue-400 hover:text-white mb-6">
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
          
          <div>
            <h1 className="text-3xl font-bold text-white">NFT Marketplace</h1>
          </div>
          
          <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden shadow-2xl">
            <div className="md:flex">
              {/* Left Column - Image */}
              <div className="md:w-1/2 relative">
                <img 
                  src={nft.image} 
                  alt={nft.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Right Column - Details */}
              <div className="md:w-1/2 p-6">
                <h1 className="text-3xl font-bold text-white mb-2">{nft.name}</h1>
                <p className="text-gray-400 mb-4">
                  {nft.collectionName} #{nft.tokenId}
                </p>
                
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white mb-2">Description</h2>
                  <p className="text-gray-300">{nft.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-gray-400 text-sm">Creator</h3>
                    <p className="text-white">{nft.creator}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm">Blockchain</h3>
                    <p className="text-white">{nft.blockchain}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm">Creation Date</h3>
                    <p className="text-white">{nft.creationDate}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Attributes</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {nft.attributes.map((attr, index) => (
                      <div key={index} className="bg-gray-800 bg-opacity-70 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-xs">{attr.trait_type}</p>
                        <p className="text-white text-sm font-medium">{attr.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {nft.history && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">History</h2>
                    <div className="space-y-3">
                      {nft.history.map((event, index) => (
                        <div 
                          key={index}
                          className="flex justify-between items-center border-b border-gray-700 py-2"
                        >
                          <div>
                            <p className="text-white font-medium">{event.event}</p>
                            <p className="text-gray-400 text-sm">{event.date}</p>
                          </div>
                          <div className="text-green-400 font-medium">
                            {event.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-8 flex space-x-4">
                  <motion.button
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg font-medium"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Transfer
                  </motion.button>
                  <motion.button
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 rounded-lg font-medium"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    List for Sale
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">NFT Not Found</h3>
          <p className="text-gray-400 mb-6">
            We couldn't find the NFT you're looking for. It may have been transferred or doesn't exist.
          </p>
          <Link to="/player/playernft">
            <motion.button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              View Your Collection
            </motion.button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NFTDetail;