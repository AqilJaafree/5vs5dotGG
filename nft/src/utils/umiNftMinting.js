// src/utils/umiNftMinting.js
import { 
  createProgrammableNft, 
  mplTokenMetadata, 
  createNft
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { 
  generateSigner, 
  signerIdentity, 
  percentAmount, 
  publicKey
} from "@metaplex-foundation/umi";
import { createSignerFromWalletAdapter } from './walletAdapter';

// Initialize Umi with wallet adapter
export const initializeUmi = (connection, walletAdapter) => {
  // Create a new Umi instance
  const umi = createUmi(connection.rpcEndpoint)
    .use(mplTokenMetadata())
    .use(irysUploader({ address: 'https://devnet.irys.xyz' }));
  
  // Add wallet adapter as signer if provided
  if (walletAdapter && walletAdapter.publicKey) {
    const signer = createSignerFromWalletAdapter(walletAdapter);
    umi.use(signerIdentity(signer));
  }
  
  return umi;
};

// Create image data from canvas (for local preview)
export const createCanvasImage = async (name, position, stats) => {
  const canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 500;
  const ctx = canvas.getContext('2d');
  
  // Calculate average stats to determine rarity
  const values = Object.values(stats);
  const avgStat = values.reduce((sum, v) => sum + v, 0) / values.length;
  
  // Set background
  ctx.fillStyle = '#1F2937';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add border based on rarity
  let borderColor;
  if (avgStat >= 85) borderColor = '#F59E0B'; // Legendary - gold
  else if (avgStat >= 70) borderColor = '#8B5CF6'; // Epic - purple
  else if (avgStat >= 50) borderColor = '#3B82F6'; // Rare - blue
  else borderColor = '#6B7280'; // Common - gray
  
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 20;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  
  // Add player icon
  ctx.fillStyle = '#374151';
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 200, 80, 0, Math.PI * 2);
  ctx.fill();
  
  // Add text
  ctx.fillStyle = 'white';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(name || 'Player Name', canvas.width / 2, 340);
  
  ctx.font = '30px Arial';
  ctx.fillText(position || 'Position', canvas.width / 2, 380);
  
  // Add stats
  ctx.font = '20px Arial';
  ctx.textAlign = 'left';
  let yPos = 420;
  
  Object.entries(stats).forEach(([key, value], index) => {
    if (index < 3) { // Only show top 3 stats
      const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
      ctx.fillText(`${formattedKey}: ${value}`, 120, yPos);
      yPos += 25;
    }
  });
  
  return canvas.toDataURL();
};

// Create player NFT
export const createPlayerNFT = async (umi, playerData) => {
  try {
    // Generate a signer for the NFT mint
    const nftMint = generateSigner(umi);
    
    // Prepare metadata - calculate player stats summary
    const statsArray = [
      parseInt(playerData.mechanical),
      parseInt(playerData.gameKnowledge),
      parseInt(playerData.teamCommunication),
      parseInt(playerData.adaptability),
      parseInt(playerData.consistency),
      parseInt(playerData.form),
      parseInt(playerData.potential)
    ];
    
    const avgStat = statsArray.reduce((sum, stat) => sum + stat, 0) / statsArray.length;
    
    // Determine rarity based on average stat value
    let rarity;
    if (avgStat >= 85) rarity = 'Legendary';
    else if (avgStat >= 70) rarity = 'Epic';
    else if (avgStat >= 50) rarity = 'Rare';
    else rarity = 'Common';
    
    // Create attributes array for metadata
    const attributes = [
      { trait_type: 'Position', value: playerData.position },
      { trait_type: 'Mechanical', value: playerData.mechanical.toString() },
      { trait_type: 'Game Knowledge', value: playerData.gameKnowledge.toString() },
      { trait_type: 'Team Communication', value: playerData.teamCommunication.toString() },
      { trait_type: 'Adaptability', value: playerData.adaptability.toString() },
      { trait_type: 'Consistency', value: playerData.consistency.toString() },
      { trait_type: 'Form', value: playerData.form.toString() },
      { trait_type: 'Potential', value: playerData.potential.toString() },
      { trait_type: 'Rarity', value: rarity },
      { trait_type: 'Power', value: Math.floor(avgStat / 10).toString() }
    ];
    
    // Prepare metadata
    const metadata = {
      name: playerData.name,
      symbol: '5VS5',
      description: `${playerData.name} - ${playerData.position} player for 5VS5dotGG`,
      image: 'https://arweave.net/placeholder-image-uri',
      attributes: attributes,
      properties: {
        files: [
          {
            uri: 'https://arweave.net/placeholder-image-uri',
            type: 'image/png'
          }
        ],
        category: 'image'
      }
    };
    
    // For a real app, you'd generate and upload an actual image before this step
    // Upload metadata to Arweave via Irys
    const metadataUri = await umi.uploader.uploadJson(metadata);
    
    // Create the NFT - using createNft for simplicity
    const tx = await createNft(umi, {
      mint: nftMint,
      name: playerData.name,
      symbol: '5VS5',
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(5), // 5% royalty
    });
    
    // Send and confirm the transaction
    const result = await tx.sendAndConfirm(umi);
    
    return {
      mint: nftMint.publicKey,
      metadataUri,
      signature: result.signature
    };
  } catch (error) {
    console.error('Error creating player NFT:', error);
    throw error;
  }
};

// Get Solana Explorer URL
export const getExplorerUrl = (mintAddress, cluster = 'devnet') => {
  return `https://explorer.solana.com/address/${mintAddress}?cluster=${cluster}`;
};