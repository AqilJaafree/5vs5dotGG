import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from './ui/Button';

const PlayerCard = ({ 
  id, 
  name, 
  image,  
  tokenId, 
  collectionName,
  attributes = [] 
}) => {

  return (
    <motion.div
      className="bg-gray/50 bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden shadow-xl outline-1 outline-white/20"
      whileHover={{ 
        y: -5, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {/* NFT Image */}
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover"
        />
        </div>
      
      <div className="p-4">
        {/* NFT Name and Token ID */}
        <h3 className="text-xl font-bold text-white mb-1 truncate">{name}</h3>
        <p className="text-gray-400 text-sm mb-3">
          {collectionName} #{tokenId}
        </p>
        
        {/* View Button */}
        <Link to={`/player/nft/${id}`}>
        <div className="flex justify-center items-center">
          <Button>
            View Details
          </Button>
        </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default PlayerCard;