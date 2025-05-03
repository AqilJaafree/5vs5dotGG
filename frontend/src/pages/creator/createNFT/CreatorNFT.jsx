import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const CreatorNFT = () => {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [earnings, setEarnings] = useState(0);

  // Load created NFTs from localStorage
  useEffect(() => {
    const fetchNFTs = async () => {
      setIsLoading(true);
      try {
        const createdNFTs = JSON.parse(localStorage.getItem('creatorNFTs') || '[]');
        setNfts(createdNFTs);
        
        // Calculate earnings
        const totalEarnings = createdNFTs
          .filter(nft => nft.soldAt)
          .reduce((total, nft) => total + (nft.price || 0), 0);
        
        setEarnings(totalEarnings);
        
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

  // Filter NFTs based on activeFilter and searchQuery
  const filteredNFTs = nfts.filter(nft => {
    if (activeFilter === 'available') {
      if (nft.soldAt) return false;
    } else if (activeFilter === 'sold') {
      if (!nft.soldAt) return false;
    }
    
    // Filter by search query
    const matchesSearch = 
      nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
          <div>
            <Link to="/creator" className="text-blue-400 flex items-center mb-2">
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
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">My Created NFTs</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-lg px-4 py-2">
              <p className="text-white">
                Earnings: <span className="font-bold text-green-400">{earnings} ₮</span>
              </p>
            </div>
            <Link to="/creator/creatornft/create">
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
                  Create New NFT
                </span>
              </Button>
            </Link>
          </div>
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
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                activeFilter === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              All NFTs
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                activeFilter === 'available' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveFilter('available')}
            >
              Available
            </button>
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                activeFilter === 'sold' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveFilter('sold')}
            >
              Sold
            </button>
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
            {nfts.length === 0 ? (
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
                <h3 className="text-xl font-bold text-white mb-2">No NFTs Created Yet</h3>
                <p className="text-gray-400 mb-6">
                  You haven't created any NFTs yet. Start by creating your first NFT!
                </p>
                <Link to="/creator/nfts/create">
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
                      Create Your First NFT
                    </span>
                  </Button>
                </Link>
              </div>
            ) : filteredNFTs.length === 0 ? (
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
                <h3 className="text-xl font-bold text-white mb-2">No Matching NFTs</h3>
                <p className="text-gray-400">
                  {searchQuery 
                    ? `No NFTs match your search for "${searchQuery}".` 
                    : `No ${activeFilter !== 'all' ? activeFilter : ''} NFTs found.`
                  }
                </p>
              </div>
            ) : (
              /* NFT Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredNFTs.map(nft => (
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

                      {/* Status Badge */}
                      <div className={`absolute top-2 left-2 ${
                        nft.soldAt ? 'bg-green-600' : 'bg-blue-600'
                      } text-white text-xs font-bold px-2 py-1 rounded-full`}>
                        {nft.soldAt ? 'Sold' : 'Listed'}
                      </div>
                      
                      {/* Price Tag */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm font-bold px-3 py-1 rounded-lg">
                        {nft.price} ₮
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h2 className="text-xl font-bold text-white mb-1 truncate">{nft.name}</h2>
                      <p className="text-gray-400 text-sm mb-3 truncate">{nft.collectionName} #{nft.tokenId}</p>
                      
                      {nft.soldAt ? (
                        <div className="bg-gray-800 rounded-lg p-3 mb-4">
                          <p className="text-gray-400 text-xs">Sold On</p>
                          <p className="text-white text-sm">{new Date(nft.soldAt).toLocaleDateString()}</p>
                        </div>
                      ) : (
                        <div className="bg-gray-800 rounded-lg p-3 mb-4">
                          <p className="text-gray-400 text-xs">Created On</p>
                          <p className="text-white text-sm">{new Date(nft.createdAt).toLocaleDateString()}</p>
                        </div>
                      )}
                      
                      <Link to={`/creator/nfts/${nft.id}`}>
                        <Button className="w-full">
                          {nft.soldAt ? 'View Details' : 'Manage Listing'}
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
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

export default CreatorNFT;