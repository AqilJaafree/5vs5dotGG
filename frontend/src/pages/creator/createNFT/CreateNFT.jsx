import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const CreateNFT = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    tokenId: '',
    collectionName: '',
    price: '',
    image: '',
    description: '',
    // Stats with default values
    stats: {
      attack: 50,
      defense: 50,
      speed: 50,
      health: 500,
      mana: 500
    },
    // Attributes array
    attributes: [
      { trait_type: '', value: '' },
      { trait_type: '', value: '' },
      { trait_type: '', value: '' }
    ]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [creatorEarnings, setCreatorEarnings] = useState(0);
  const [createdNFTs, setCreatedNFTs] = useState([]);
  
  // Load previously created NFTs from localStorage
  useEffect(() => {
    const creatorNFTs = JSON.parse(localStorage.getItem('creatorNFTs') || '[]');
    setCreatedNFTs(creatorNFTs);
    
    // Calculate creator earnings
    const earnings = creatorNFTs.reduce((total, nft) => {
      // If NFT has been sold (has a soldAt timestamp), add its price to earnings
      if (nft.soldAt) {
        return total + nft.price;
      }
      return total;
    }, 0);
    
    setCreatorEarnings(earnings);
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('stats.')) {
      // Handle stats changes
      const statName = name.split('.')[1];
      setFormData({
        ...formData,
        stats: {
          ...formData.stats,
          [statName]: Number(value)
        }
      });
    } else if (name.startsWith('attribute')) {
      // Handle attribute changes
      // Format: attribute[index].[trait_type/value]
      const parts = name.match(/attribute\[(\d+)\]\.(\w+)/);
      if (parts) {
        const index = parseInt(parts[1]);
        const field = parts[2]; // either "trait_type" or "value"
        
        const updatedAttributes = [...formData.attributes];
        updatedAttributes[index] = {
          ...updatedAttributes[index],
          [field]: value
        };
        
        setFormData({
          ...formData,
          attributes: updatedAttributes
        });
      }
    } else {
      // Handle regular field changes
      setFormData({
        ...formData,
        [name]: name === 'price' ? Number(value) : value
      });
    }
  };
  
  // Add new attribute field
  const addAttribute = () => {
    if (formData.attributes.length < 6) {
      setFormData({
        ...formData,
        attributes: [...formData.attributes, { trait_type: '', value: '' }]
      });
    }
  };
  
  // Remove attribute field
  const removeAttribute = (index) => {
    const updatedAttributes = formData.attributes.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      attributes: updatedAttributes
    });
  };
  
  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.tokenId.trim()) errors.tokenId = 'Token ID is required';
    if (!formData.collectionName.trim()) errors.collectionName = 'Collection name is required';
    if (!formData.price || formData.price <= 0) errors.price = 'Price must be greater than 0';
    if (!formData.image.trim()) errors.image = 'Image URL is required';
    
    // Validate attributes - at least one must be filled
    const hasValidAttribute = formData.attributes.some(
      attr => attr.trait_type.trim() && attr.value.trim()
    );
    
    if (!hasValidAttribute) {
      errors.attributes = 'At least one attribute must be filled';
    }
    
    return errors;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create NFT object
      const newNFT = {
        id: `c${Date.now()}`, // 'c' prefix to indicate creator-made NFT
        name: formData.name,
        image: formData.image,
        tokenId: formData.tokenId,
        collectionName: formData.collectionName,
        description: formData.description,
        price: formData.price,
        creator: 'Current Creator', // In a real app, would be the creator's username/address
        createdAt: new Date().toISOString(),
        stats: formData.stats,
        attributes: formData.attributes.filter(attr => attr.trait_type.trim() && attr.value.trim())
      };
      
      // Save to creator's NFTs in localStorage
      const creatorNFTs = JSON.parse(localStorage.getItem('creatorNFTs') || '[]');
      creatorNFTs.push(newNFT);
      localStorage.setItem('creatorNFTs', JSON.stringify(creatorNFTs));
      
      // Add to marketplace
      const marketplace = JSON.parse(localStorage.getItem('nftMarketplace') || '[]');
      marketplace.push(newNFT);
      localStorage.setItem('nftMarketplace', JSON.stringify(marketplace));
      
      // Success
      setIsSubmitting(false);
      
      // Show success message
      alert(`${formData.name} NFT created successfully and listed in the marketplace!`);
      
      // Reset form or navigate
      setFormData({
        name: '',
        tokenId: '',
        collectionName: '',
        price: '',
        image: '',
        description: '',
        stats: {
          attack: 50,
          defense: 50,
          speed: 50,
          health: 500,
          mana: 500
        },
        attributes: [
          { trait_type: '', value: '' },
          { trait_type: '', value: '' },
          { trait_type: '', value: '' }
        ]
      });
      
      // Refresh created NFTs list
      setCreatedNFTs([...creatorNFTs]);
      
    } catch (error) {
      console.error('Error creating NFT:', error);
      setFormErrors({ submit: 'Error creating NFT. Please try again.' });
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Create NFT</h1>
          <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-lg px-4 py-2">
            <p className="text-white">
              Earnings: <span className="font-bold text-green-400">{creatorEarnings} ₮</span>
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* NFT Creation Form */}
          <div className="lg:col-span-2">
            <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">NFT Details</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Name */}
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="name">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="NFT Name"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  
                  {/* Token ID */}
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="tokenId">
                      Token ID *
                    </label>
                    <input
                      type="text"
                      id="tokenId"
                      name="tokenId"
                      value={formData.tokenId}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Unique Token ID"
                    />
                    {formErrors.tokenId && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.tokenId}</p>
                    )}
                  </div>
                  
                  {/* Collection Name */}
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="collectionName">
                      Collection Name *
                    </label>
                    <input
                      type="text"
                      id="collectionName"
                      name="collectionName"
                      value={formData.collectionName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Collection Name"
                    />
                    {formErrors.collectionName && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.collectionName}</p>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="price">
                      Price (₮) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="NFT Price"
                      min="1"
                    />
                    {formErrors.price && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                    )}
                  </div>
                  
                  {/* Image URL */}
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="image">
                      Image URL *
                    </label>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formErrors.image && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="3"
                    placeholder="Describe your NFT"
                  />
                </div>
                
                {/* Stats sliders */}
                <h3 className="text-lg font-semibold text-white mb-3">Stats</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Attack */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-gray-300" htmlFor="stats.attack">
                        Attack
                      </label>
                      <span className="text-red-400">{formData.stats.attack}</span>
                    </div>
                    <input
                      type="range"
                      id="stats.attack"
                      name="stats.attack"
                      min="1"
                      max="100"
                      value={formData.stats.attack}
                      onChange={handleInputChange}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>
                  
                  {/* Defense */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-gray-300" htmlFor="stats.defense">
                        Defense
                      </label>
                      <span className="text-blue-400">{formData.stats.defense}</span>
                    </div>
                    <input
                      type="range"
                      id="stats.defense"
                      name="stats.defense"
                      min="1"
                      max="100"
                      value={formData.stats.defense}
                      onChange={handleInputChange}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                  
                  {/* Speed */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-gray-300" htmlFor="stats.speed">
                        Speed
                      </label>
                      <span className="text-green-400">{formData.stats.speed}</span>
                    </div>
                    <input
                      type="range"
                      id="stats.speed"
                      name="stats.speed"
                      min="1"
                      max="100"
                      value={formData.stats.speed}
                      onChange={handleInputChange}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                  </div>
                  
                  {/* Health */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-gray-300" htmlFor="stats.health">
                        Health
                      </label>
                      <span className="text-purple-400">{formData.stats.health}</span>
                    </div>
                    <input
                      type="range"
                      id="stats.health"
                      name="stats.health"
                      min="100"
                      max="1200"
                      value={formData.stats.health}
                      onChange={handleInputChange}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                  
                  {/* Mana */}
                  <div className="md:col-span-2">
                    <div className="flex justify-between mb-1">
                      <label className="text-gray-300" htmlFor="stats.mana">
                        Mana
                      </label>
                      <span className="text-cyan-400">{formData.stats.mana}</span>
                    </div>
                    <input
                      type="range"
                      id="stats.mana"
                      name="stats.mana"
                      min="100"
                      max="1200"
                      value={formData.stats.mana}
                      onChange={handleInputChange}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>
                </div>
                
                {/* Attributes */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-white">Attributes</h3>
                    <button
                      type="button"
                      className="text-blue-400 text-sm"
                      onClick={addAttribute}
                      disabled={formData.attributes.length >= 6}
                    >
                      + Add Attribute
                    </button>
                  </div>
                  
                  {formData.attributes.map((attr, index) => (
                    <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                      <div className="col-span-2">
                        <input
                          type="text"
                          name={`attribute[${index}].trait_type`}
                          value={attr.trait_type}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                          placeholder="Trait name"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="text"
                          name={`attribute[${index}].value`}
                          value={attr.value}
                          onChange={handleInputChange}
                          className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
                          placeholder="Value"
                        />
                      </div>
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeAttribute(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {formErrors.attributes && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.attributes}</p>
                  )}
                </div>
                
                {formErrors.submit && (
                  <p className="text-red-500 text-sm mb-4">{formErrors.submit}</p>
                )}
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg 
                        className="animate-spin h-5 w-5 mr-2" 
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
                      Creating NFT...
                    </span>
                  ) : (
                    "Create and List NFT"
                  )}
                </Button>
              </form>
            </div>
          </div>
          
          {/* NFT Preview */}
          <div className="lg:col-span-1">
            <div className="bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl sticky top-8">
              <h2 className="text-xl font-bold text-white mb-4">NFT Preview</h2>
              
              <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                <div className="relative">
                  {formData.image ? (
                    <img 
                      src={formData.image} 
                      alt={formData.name || "NFT Preview"}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x400?text=Invalid+Image+URL";
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Price Tag */}
                  {formData.price && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm font-bold px-3 py-1 rounded-lg">
                      {formData.price} ₮
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-1 truncate">
                    {formData.name || "NFT Name"}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 truncate">
                    {formData.collectionName || "Collection"} #{formData.tokenId || "ID"}
                  </p>
                  
                  {/* Stats Preview */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-gray-800 rounded-md p-1 text-center">
                      <p className="text-red-400 text-xs">ATK</p>
                      <p className="text-white text-sm font-medium">{formData.stats.attack}</p>
                    </div>
                    <div className="bg-gray-800 rounded-md p-1 text-center">
                      <p className="text-blue-400 text-xs">DEF</p>
                      <p className="text-white text-sm font-medium">{formData.stats.defense}</p>
                    </div>
                    <div className="bg-gray-800 rounded-md p-1 text-center">
                      <p className="text-green-400 text-xs">SPD</p>
                      <p className="text-white text-sm font-medium">{formData.stats.speed}</p>
                    </div>
                  </div>
                  
                  {/* Attributes Preview */}
                  <div className="space-y-2">
                    {formData.attributes.map((attr, index) => {
                      if (!attr.trait_type || !attr.value) return null;
                      return (
                        <div key={index} className="bg-gray-800 rounded-md p-2">
                          <p className="text-gray-400 text-xs">{attr.trait_type}</p>
                          <p className="text-white text-sm font-medium">{attr.value}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-white font-medium mb-2">Your Created NFTs</h3>
                <p className="text-gray-400 text-sm">
                  Total: {createdNFTs.length} NFTs
                </p>
                <Link to="/creator/nfts">
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                    View All Created NFTs
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateNFT;