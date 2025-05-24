// frontend/src/pages/Marketplace.jsx
// Updated with your actual NFT mint addresses

import React, { useState, useEffect } from 'react'
import NFTBox from '../components/NFTBox'
import LoadingSpinner from '../components/LoadingSpinner';
import { useWallet } from '@solana/wallet-adapter-react';

const Marketplace = () => {
  const { connected } = useWallet();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // The image URL from Irys gateway
  const baseImageUrl = "https://gateway.irys.xyz/6y26DhHoqoTgYvkhKXNpakDMpetJWwqZD8R78RtEZFK9";
  
  // Fetch NFTs data
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setLoading(true);
        
        // NFT data with your actual mint addresses from the minting output
        const gameNFTs = [
          { 
            id: 1, 
            name: 'Mage - Top Lane', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: '96BRaadAydRt51Hcg31jURzdVUqJD7hViTeTWYjvyVS4',
            role: 'Mage',
            position: 'Top Lane'
          },
          { 
            id: 2, 
            name: 'Marksman - Bot Lane', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: 'AiHxT88TB69DUciEaBvt3LNtGcAhEM4uqBGuiC5JRhuq',
            role: 'Marksman',
            position: 'Bot Lane'
          },
          { 
            id: 3, 
            name: 'Tank - Mid Lane', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: 'GXnVkCZspJCxZxoznSDDufJscEnhVkUMe4x9qZNM4diW',
            role: 'Tank',
            position: 'Mid Lane'
          },
          { 
            id: 4, 
            name: 'Tank - Bot Lane', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: 'GZkFQrnu5UEBnqxWrY8QZURsQj92iwAG2PwYMw7eAy2E',
            role: 'Tank',
            position: 'Bot Lane'
          },
          { 
            id: 5, 
            name: 'Marksman - Top Lane', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: 'CTmb6GpBkw8G56raiaN8UxcQPvR1dSY4NnCB9xVDgLc1',
            role: 'Marksman',
            position: 'Top Lane'
          },
          { 
            id: 6, 
            name: 'Tank - Jungler', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: 'CgtLgpkN43LQrYpbMLBvTFfu365bbCdiGA18sMh36Q2R',
            role: 'Tank',
            position: 'Jungler'
          },
          { 
            id: 7, 
            name: 'Support - Support', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: '7Tun7kgbrgDkEYGRuYJXKmNUx2p8sZi8cYp6vNEa4VGW',
            role: 'Support',
            position: 'Support'
          },
          { 
            id: 8, 
            name: 'Support - Support', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: '56vXzXyEpvPbRJQGxHaWVZGyAimzwuCMHDYv8qoVgU59',
            role: 'Support',
            position: 'Support'
          },
          { 
            id: 9, 
            name: 'Support - Top Lane', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: '92Q9nJ5XSMKNCdMAvBDvHCLwtVSd1JFMR1dBNLYv5h2y',
            role: 'Support',
            position: 'Top Lane'
          },
          { 
            id: 10, 
            name: 'Tank - Top Lane', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: '82hg1nwp9t6919sBvmQJoz9HjCgi1L3xkYECpeapz7Jz',
            role: 'Tank',
            position: 'Top Lane'
          },
        ];
        
        setNfts(gameNFTs);
        setLoading(false);
        
      } catch (err) {
        console.error('Error fetching NFTs:', err);
        setError('Failed to load NFTs. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchNFTs();
  }, []);
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-[calc(100svh-8rem)]">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button 
            className="mt-4 bg-yellow-300 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // If no NFTs are available
  if (nfts.length === 0) {
    return (
      <div className="flex justify-center items-center h-[calc(100svh-8rem)]">
        <p className="text-gray-500 text-center">No NFTs available in the marketplace at the moment.</p>
      </div>
    );
  }
  
  // Show a wallet connection message if not connected
  if (!connected) {
    return (
      <div className="">
        <h1 className="text-2xl font-bold my-2 text-center">NFT Marketplace</h1>
        <div className="flex justify-center items-center mt-10">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md text-center">
            <p className="text-white mb-4">Connect your wallet to view and claim NFTs</p>
            <p className="text-gray-400 text-sm">Use the wallet button in your profile page to connect.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pb-2">
      <h1 className="text-2xl font-bold my-2 text-center">NFT Marketplace</h1>
      
      <div className="overflow-auto scrollbar-hide container mx-auto px-4 max-h-[calc(100svh-13rem)]">
        {/* NFT Grid with 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
          {nfts.map((nft) => (
            <NFTBox 
              key={nft.id}
              image={nft.image}
              name={nft.name}
              price={nft.price}
              mintAddress={nft.mintAddress}
              role={nft.role}
              position={nft.position}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;