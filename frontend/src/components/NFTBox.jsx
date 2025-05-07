import React from 'react'
import Button from '../components/ui/Button'

const NFTBox = ({ image, name, price, id }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full max-h-[calc(100svh-8rem)] overflow-hidden flex flex-col">
      <div className="flex flex-col h-full justify-between">
        {/* NFT Image Container - Will scale appropriately */}
        <div className="flex justify-center items-center flex-grow">
          <div className="bg-white rounded-xl overflow-hidden w-28 aspect-square max-w-[200px]">
            <img 
              src={image || "/placeholder-nft.png"} 
              alt={`${name || "NFT"} image`} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* NFT Info - Fixed height */}
        <div className="text-center mt-3 mb-2">
          <h3 className="text-white font-semibold text-lg truncate">{name || "Unnamed NFT"}</h3>
          {price && <p className="text-gray-300">{price}</p>}
        </div>

        {/* Claim button - Fixed height */}
        <div className="flex justify-center items-center">
          <Button text="Claim" variant="primary" />
        </div>
      </div>
    </div>
  )
}

export default NFTBox