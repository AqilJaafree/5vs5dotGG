// src/components/NFTBox.jsx
import React, { useState, useEffect } from 'react'
import Button from './ui/Button'
import { useWallet } from '@solana/wallet-adapter-react';
import { claimNFT, checkNFTOwnership } from '../utils/nftUtils';
import { useBolt } from '../context/BoltContext';

// Role-based colors
const roleColors = {
  'Tank': 'border-blue-500',
  'Support': 'border-green-500',
  'Mage': 'border-purple-500',
  'Assassin': 'border-red-500',
  'Marksman': 'border-yellow-500'
};

const NFTBox = ({ image, name, price, mintAddress, role, position }) => {
  const { publicKey, connected } = useWallet();
  const { connection, wallet, world, initializeWorld } = useBolt();
  
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState(null);
  const [owned, setOwned] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [playerEntity, setPlayerEntity] = useState(null);
  const [processingEntity, setProcessingEntity] = useState(false);
  
  // Get role-specific styling
  const borderColor = roleColors[role] || 'border-gray-500';
  
  // Check if this NFT is already owned
  useEffect(() => {
    const checkOwnership = async () => {
      if (connected && publicKey && mintAddress) {
        try {
          const isOwned = await checkNFTOwnership(publicKey, mintAddress);
          setOwned(isOwned);
        } catch (err) {
          console.error('Error checking ownership:', err);
        }
      }
    };
    
    checkOwnership();
  }, [connected, publicKey, mintAddress]);
  
  // Handle NFT claiming
  const handleClaim = async () => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (owned) {
      setError('You already own this NFT');
      return;
    }
    
    try {
      setClaiming(true);
      setError(null);
      
      // Initialize world if not already initialized
      let worldPda = world;
      if (!worldPda) {
        try {
          setProcessingEntity(true);
          worldPda = await initializeWorld();
        } catch (worldError) {
          console.log('Could not initialize world, but will continue with NFT claim');
        } finally {
          setProcessingEntity(false);
        }
      }
      
      // Claim NFT with integrated entity creation
      const result = await claimNFT(
        publicKey, 
        mintAddress,
        connection,
        wallet,
        worldPda
      );
      
      setOwned(true);
      
      // If entity was created, store the reference
      if (result.entityPda) {
        setPlayerEntity({
          entityId: result.entityPda,
          componentId: result.componentPda
        });
        console.log('Player entity created:', result.entityPda);
      }
      
    } catch (err) {
      console.error('Error claiming NFT:', err);
      setError(err.message || 'Failed to claim NFT');
    } finally {
      setClaiming(false);
    }
  };
  
  // Handle image loading
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  return (
    <div className={`bg-gray-900 p-4 rounded-lg shadow-lg w-full overflow-hidden flex flex-col border-l-4 ${borderColor}`}>
      <div className="flex flex-col h-full justify-between">
        {/* NFT Image */}
        <div className="flex justify-center items-center flex-grow relative">
          <div className="bg-gray-800 rounded-xl overflow-hidden w-28 aspect-square max-w-[200px] relative">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img 
              src={image} 
              alt={`${name} image`} 
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={handleImageLoad}
              onError={() => setImageLoaded(true)}
            />
            
            {/* Role badge */}
            <div className="absolute top-1 right-1 text-xs text-white px-2 py-1 rounded-full bg-purple-500">
              {role}
            </div>
            
            {/* Entity badge - show if player entity exists */}
            {playerEntity && (
              <div className="absolute bottom-1 left-1 text-xs text-white px-2 py-1 rounded-full bg-green-500">
                Entity
              </div>
            )}
          </div>
        </div>
        
        {/* NFT Info */}
        <div className="text-center mt-3 mb-2">
          <h3 className="text-white font-semibold text-lg truncate">{name}</h3>
          <p className="text-gray-300 text-sm">{position}</p>
          {price && <p className="text-yellow-300 font-bold">{price}</p>}
          
          {/* Mint address */}
          <p className="text-gray-400 text-xs truncate mt-1">
            {mintAddress.slice(0, 4)}...{mintAddress.slice(-4)}
          </p>
          
          {/* Display entity ID if available */}
          {playerEntity && (
            <p className="text-green-400 text-xs truncate mt-1">
              Entity: {playerEntity.entityId.slice(0, 4)}...{playerEntity.entityId.slice(-4)}
            </p>
          )}
          
          {/* Error message */}
          {error && (
            <p className="text-red-300 text-xs mt-1">{error}</p>
          )}
        </div>

        {/* Claim button */}
        <div className="flex justify-center items-center">
          <Button 
            text={
              claiming ? "Claiming..." : 
              processingEntity ? "Processing..." :
              owned ? (playerEntity ? "Owned & Ready" : "Owned") : 
              "Claim"
            } 
            variant={owned ? "outline" : "primary"}
            onClick={handleClaim}
            disabled={claiming || processingEntity || owned || !connected}
          />
        </div>
      </div>
    </div>
  )
}

export default NFTBox;