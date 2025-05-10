import React, { useState, useEffect } from 'react'
import NFTBox from '../components/NFTBox'
import LoadingSpinner from '../components/LoadingSpinner';

const Marketplace = () => {
  // State to store NFTs from the marketplace
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch NFTs from your API or blockchain
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setLoading(true);
        
        // Replace this with your actual API call to get NFTs from the marketplace
        // For example: const response = await fetch('your-api-endpoint');
        
        // Mock data for demonstration
        const mockNFTs = [
          { id: 1, name: 'Cosmic Voyager', image: '/src/assets/img/test.png', price: '0.05 ETH' },
          { id: 2, name: 'Digital Dream', image: '/images/nft2.jpg', price: '0.07 ETH' },
          { id: 3, name: 'Neon Horizon', image: '/images/nft3.jpg', price: '0.12 ETH' },
          { id: 4, name: 'Virtual Reality', image: '/images/nft4.jpg', price: '0.09 ETH' },
          { id: 5, name: 'Pixelated Universe', image: '/images/nft5.jpg', price: '0.15 ETH' },
        ];
        
        // Set a small timeout to simulate API call
        setTimeout(() => {
          setNfts(mockNFTs);
          setLoading(false);
        }, 1000);
        
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
  
  return (
    <div className="">
      <h1 className="text-2xl font-bold my-2 text-center">NFT Marketplace</h1>
      <div className="overflow-auto scrollbar-hide container mx-auto px-4 max-h-[calc(100svh-13rem)] ">
        {/* NFT Grid with 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nfts.map((nft) => (
            <NFTBox 
              key={nft.id}
              image={nft.image}
              name={nft.name}
              price={nft.price}
              id={nft.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;