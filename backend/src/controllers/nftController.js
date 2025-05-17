// src/controllers/nftController.js
const solanaService = require('../services/solanaService');

/**
 * Handle NFT claim request
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
async function claimNFT(req, res, next) {
  try {
    const { userWallet, mintAddress } = req.body;
    
    // Validate required parameters
    if (!userWallet || !mintAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: userWallet and mintAddress'
      });
    }
    
    // Transfer NFT
    const result = await solanaService.transferNFT(userWallet, mintAddress);
    
    return res.status(200).json({
      success: true,
      ...result
    });
    
  } catch (error) {
    console.error('Error in claimNFT controller:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Check if a wallet owns a specific NFT
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
async function checkNFTOwnership(req, res, next) {
  try {
    const { walletAddress, mintAddress } = req.query;
    
    // Validate required parameters
    if (!walletAddress || !mintAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: walletAddress and mintAddress'
      });
    }
    
    // Check NFT ownership
    const owned = await solanaService.checkNFTOwnership(walletAddress, mintAddress);
    
    return res.status(200).json({
      success: true,
      owned,
      walletAddress,
      mintAddress
    });
    
  } catch (error) {
    console.error('Error in checkNFTOwnership controller:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Get all NFTs owned by a wallet
 * 
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
async function getWalletNFTs(req, res, next) {
  try {
    const { walletAddress } = req.params;
    
    // Validate required parameters
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: walletAddress'
      });
    }
    
    // Get wallet NFTs
    const nfts = await solanaService.getWalletNFTs(walletAddress);
    
    return res.status(200).json({
      success: true,
      walletAddress,
      nfts,
      count: nfts.length
    });
    
  } catch (error) {
    console.error('Error in getWalletNFTs controller:', error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = {
  claimNFT,
  checkNFTOwnership,
  getWalletNFTs
};