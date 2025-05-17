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
  const baseImageUrl = "https://gateway.irys.xyz/9GWEH5KS7cpfJgMVpCsRP5NvD94ozZ2eBQUbuS5ETZ1a";
  
  // Fetch NFTs data
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setLoading(true);
        
        // NFT data with real mint addresses
        const gameNFTs = [
          { 
            id: 1, 
            name: 'Support - Bot Lane', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: '3NGTLCXNSeSE33iGsCFHk7N22c63uyvT2CUrHTk2inyQ',
            role: 'Support',
            position: 'Bot Lane'
          },
          { 
            id: 2, 
            name: 'Mage - Top Lane', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: 'BxQ1MLKXzGA1idqMMdSiK5LztyFdv2ks4Go8rryBTP31',
            role: 'Mage',
            position: 'Top Lane'
          },
          { 
            id: 3, 
            name: 'Assassin - Bot Lane', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: '2HKy29QTDCdCt4262ujEYBrcVa6f2xnsWSGAMcrEi2Hc',
            role: 'Assassin',
            position: 'Bot Lane'
          },
          { 
            id: 4, 
            name: 'Assassin - Jungler', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: '93bmRk3zFXhTrH8KkVMo3YkavdZi5eJnmknxA8TTSbh6',
            role: 'Assassin',
            position: 'Jungler'
          },
          { 
            id: 5, 
            name: 'Marksman - Bot Lane', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: 'BZvcaVko3Umk6RMDFs6m16Gi2eMtPcrqoJtUbykK8H3s',
            role: 'Marksman',
            position: 'Bot Lane'
          },
          { 
            id: 6, 
            name: 'Marksman - Jungler', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: 'C8YQnR6VXTiHdf3UoWdcBXP3RPDisRntV9ADPmztkC9J',
            role: 'Marksman',
            position: 'Jungler'
          },
          { 
            id: 7, 
            name: 'Assassin - Mid Lane', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: '2Hfw6so4g1tcQBXL1VAgKMhwoYLaCcgeqqMCCYtfBeBn',
            role: 'Assassin',
            position: 'Mid Lane'
          },
          { 
            id: 8, 
            name: 'Support - Top Lane', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: 'Akj8uM3DC126mNPgUCErApR3Q9QJXNm6iN2684vfZmDw',
            role: 'Support',
            position: 'Top Lane'
          },
          { 
            id: 9, 
            name: 'Tank - Bot Lane', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: '42ThcxMwne9FNWVTyhQ3NLv6WhYJvst8tAWgAC9vUzTc',
            role: 'Tank',
            position: 'Bot Lane'
          },
          { 
            id: 10, 
            name: 'Assassin - Jungler', 
            image: baseImageUrl,
            price: '0.05 SOL',
            mintAddress: '7ccoMis1akoEG6TJPQbH8emXyaq6QJGBzDJx8gSxL3jz',
            role: 'Assassin',
            position: 'Jungler'
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