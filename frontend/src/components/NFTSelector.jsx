import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NFTSelector = ({ nfts, onSelect, onClose, selectedNFTs = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Filter NFTs based on search query and active filter
  const filteredNFTs = nfts.filter(nft => {
    // Filter out already selected NFTs
    const isNotSelected = !selectedNFTs.some(selected => selected?.id === nft.id);
    
    // Filter by rarity if not "all"
    const passesRarityFilter = activeFilter === 'all' || nft.rarity.toLowerCase() === activeFilter.toLowerCase();
    
    // Filter by search query
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          nft.collectionName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return isNotSelected && passesRarityFilter && matchesSearch;
  });
  
  // Available rarities for filter
  const rarities = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
  
  // Get the background color for rarity badges
  const getRarityColor = (rarity) => {
    const rarityColors = {
      common: 'bg-gray-500',
      uncommon: 'bg-green-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-orange-500',
      mythic: 'bg-red-500'
    };
    
    return rarityColors[rarity?.toLowerCase()] || 'bg-gray-500';
  };

  // Modal overlay animations
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  // Modal content animations
  const contentVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { delay: 0.1 } }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm z-50 flex items-center justify-center"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
      >
        <motion.div
          className="bg-gray-900 rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl"
          variants={contentVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Select NFT for Your Team</h2>
            <button
              className="text-gray-400 hover:text-white transition-colors"
              onClick={onClose}
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
          
          {/* Search and Filters */}
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search NFTs..."
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
              
              {/* Rarity Filters */}
              <div className="flex flex-wrap gap-2">
                {rarities.map(rarity => (
                  <button
                    key={rarity}
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                      activeFilter === rarity 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveFilter(rarity)}
                  >
                    {rarity}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* NFT List */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 180px)' }}>
            {filteredNFTs.length === 0 ? (
              <div className="text-center py-10">
                <svg 
                  className="w-16 h-16 text-gray-600 mx-auto mb-4" 
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
                <h3 className="text-xl font-bold text-white mb-2">No Available NFTs</h3>
                <p className="text-gray-400">
                  {searchQuery 
                    ? `No NFTs match your search for "${searchQuery}".` 
                    : selectedNFTs.length > 0 
                      ? "All your NFTs are already assigned to team slots." 
                      : "You don't have any NFTs yet."
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNFTs.map(nft => (
                  <motion.div
                    key={nft.id}
                    className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl"
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelect(nft)}
                  >
                    <div className="relative">
                      <img 
                        src={nft.image} 
                        alt={nft.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                        {nft.rarity}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-white font-bold mb-1 truncate">{nft.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">
                        {nft.collectionName} #{nft.tokenId}
                      </p>
                      
                      {/* Stats Preview */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-gray-700 rounded-md p-1">
                          <span className="text-red-400 text-xs block">ATK</span>
                          <span className="text-white font-medium">{nft.stats.attack}</span>
                        </div>
                        <div className="bg-gray-700 rounded-md p-1">
                          <span className="text-blue-400 text-xs block">DEF</span>
                          <span className="text-white font-medium">{nft.stats.defense}</span>
                        </div>
                        <div className="bg-gray-700 rounded-md p-1">
                          <span className="text-green-400 text-xs block">SPD</span>
                          <span className="text-white font-medium">{nft.stats.speed}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NFTSelector;