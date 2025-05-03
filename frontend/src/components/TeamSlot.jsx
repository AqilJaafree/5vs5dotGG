import React from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';

const TeamSlot = ({ slotIndex, nft, onAssign, onRemove }) => {
  // Position labels for the slots
  const positionLabels = [
    "Team Leader",
    "Front Line",
    "Support",
    "Special",
    "Utility"
  ];

  // Get rarity color for background styling
  const getRarityColor = (rarity) => {
    const colors = {
      common: 'from-gray-700 to-gray-900',
      uncommon: 'from-green-700 to-green-900',
      rare: 'from-blue-700 to-blue-900',
      epic: 'from-purple-700 to-purple-900',
      legendary: 'from-orange-700 to-orange-900',
      mythic: 'from-red-700 to-red-900',
    };
    
    return colors[rarity?.toLowerCase()] || 'from-gray-700 to-gray-900';
  };

  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden shadow-xl h-80
        ${nft 
          ? `bg-gradient-to-br ${getRarityColor(nft.rarity)}` 
          : 'bg-gray-800 bg-opacity-50'}`}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: slotIndex * 0.1 }}
    >
      {/* Position Label */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
        {positionLabels[slotIndex]}
      </div>
      
      {/* Slot Number */}
      <div className="absolute top-2 right-2 bg-gray-900 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full z-10">
        {slotIndex + 1}
      </div>
      
      {nft ? (
        // Filled Slot
        <>
          {/* NFT Image */}
          <div className="h-40 overflow-hidden">
            <img 
              src={nft.image}
              alt={nft.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* NFT Info */}
          <div className="p-3">
            <h3 className="text-white font-bold text-lg mb-1 truncate">{nft.name}</h3>
            <p className="text-gray-300 text-sm mb-2">{nft.collectionName} #{nft.tokenId}</p>
            
            {/* Stats Preview */}
            <div className="grid grid-cols-3 gap-1">
              <div className="flex flex-col items-center">
                <span className="text-red-400 text-xs">ATK</span>
                <span className="text-white font-medium">{nft.stats.attack}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-blue-400 text-xs">DEF</span>
                <span className="text-white font-medium">{nft.stats.defense}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-green-400 text-xs">SPD</span>
                <span className="text-white font-medium">{nft.stats.speed}</span>
              </div>
            </div>
          </div>
          
          {/* Remove Button */}
          <Button
            className="absolute bottom-2 right-2 bg-red-600 text-white p-1 rounded-full"
            onClick={onRemove}
          >
            <svg 
              className="w-5 h-5" 
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
          </Button>
        </>
      ) : (
        // Empty Slot
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="bg-gray-700 bg-opacity-50 rounded-full p-3 mb-4">
            <svg 
              className="w-10 h-10 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
          </div>
          <p className="text-gray-300 text-center mb-2">Slot {slotIndex + 1} Empty</p>
          <Button
            onClick={onAssign}
          >
            Assign NFT
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default TeamSlot;