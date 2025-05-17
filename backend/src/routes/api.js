// src/routes/api.js
const express = require('express');
const nftController = require('../controllers/nftController');

const router = express.Router();

// NFT endpoints
router.post('/claim-nft', nftController.claimNFT);
router.get('/nft/check-ownership', nftController.checkNFTOwnership);
router.get('/nft/wallet/:walletAddress', nftController.getWalletNFTs);

module.exports = router;