// src/utils/umiNftMinting.js
import { 
  createNft,
  mplTokenMetadata
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

// Initialize Umi with wallet adapter specifically for Solana devnet
export const initializeUmi = (connection, walletAdapter) => {
  try {
    // Verify we're connecting to devnet
    const endpoint = connection.rpcEndpoint;
    console.log("Connecting to Solana network:", endpoint);
    
    if (!endpoint.includes('devnet')) {
      console.warn("Warning: Not connected to devnet. This application is designed for devnet use.");
    }
    
    // Create a new Umi instance specifically configured for devnet
    const umi = createUmi(endpoint)
      .use(mplTokenMetadata())
      .use(irysUploader({ 
        address: 'https://devnet.irys.xyz',
        timeout: 120000 // 2 minute timeout for uploads
      }));
    
    // Add wallet adapter as signer - required for transactions
    if (walletAdapter && walletAdapter.publicKey) {
      console.log("Setting up wallet for devnet transactions:", walletAdapter.publicKey.toBase58());
      const signer = createSignerFromWalletAdapter(walletAdapter);
      umi.use(signerIdentity(signer));
    } else {
      throw new Error('Wallet not connected. Please connect your wallet before proceeding.');
    }
    
    return umi;
  } catch (error) {
    console.error("Error initializing Umi for devnet:", error);
    throw error;
  }
};

// Create image data from canvas (for local preview)
export const createCanvasImage = async (name, position, stats) => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    
    // Calculate average stats to determine rarity
    const values = Object.values(stats);
    const avgStat = values.reduce((sum, v) => sum + parseInt(v), 0) / values.length;
    
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
  } catch (error) {
    console.error("Error creating canvas image:", error);
    return null;
  }
};

// Create player NFT specifically for Solana devnet
export const createPlayerNFT = async (umi, playerData) => {
  try {
    console.log("Starting NFT creation process on Solana devnet...");
    
    // Verify we have a valid Umi instance
    if (!umi) {
      throw new Error('Umi instance not initialized properly');
    }
    
    // Generate a signer for the NFT mint
    const nftMint = generateSigner(umi);
    console.log("Generated NFT mint address on devnet:", nftMint.publicKey.toString());
    
    // Prepare metadata - calculate player stats summary
    const statsArray = [
      parseInt(playerData.mechanical),
      parseInt(playerData.gameKnowledge),
      parseInt(playerData.teamCommunication)
    ];
    
    // Add additional stats if present
    if (playerData.adaptability) statsArray.push(parseInt(playerData.adaptability));
    if (playerData.consistency) statsArray.push(parseInt(playerData.consistency));
    if (playerData.form) statsArray.push(parseInt(playerData.form));
    if (playerData.potential) statsArray.push(parseInt(playerData.potential));
    
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
      { trait_type: 'Team Communication', value: playerData.teamCommunication.toString() }
    ];
    
    // Add optional attributes if present
    if (playerData.adaptability) {
      attributes.push({ trait_type: 'Adaptability', value: playerData.adaptability.toString() });
    }
    if (playerData.consistency) {
      attributes.push({ trait_type: 'Consistency', value: playerData.consistency.toString() });
    }
    if (playerData.form) {
      attributes.push({ trait_type: 'Form', value: playerData.form.toString() });
    }
    if (playerData.potential) {
      attributes.push({ trait_type: 'Potential', value: playerData.potential.toString() });
    }
    
    // Add calculated attributes
    attributes.push({ trait_type: 'Rarity', value: rarity });
    attributes.push({ trait_type: 'Power', value: Math.floor(avgStat / 10).toString() });
    
    // Generate a canvas image for preview (in a real app, you'd upload this to Arweave/IPFS)
    const imageDataUrl = await createCanvasImage(
      playerData.name,
      playerData.position,
      {
        Mechanical: playerData.mechanical,
        'Game Knowledge': playerData.gameKnowledge,
        'Team Communication': playerData.teamCommunication
      }
    );
    
    // Prepare metadata with placeholder image URI
    // For a full production app, you would upload the real image to Arweave/IPFS first
    const metadata = {
      name: playerData.name,
      symbol: '5VS5',
      description: `${playerData.name} - ${playerData.position} player for 5VS5dotGG`,
      // Placeholder image URI - in production you'd upload and use the actual image
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
    
    console.log("Uploading metadata to Arweave via Irys (devnet)...");
    
    // Upload metadata to Arweave via Irys (Bundlr)
    let metadataUri;
    try {
      metadataUri = await umi.uploader.uploadJson(metadata);
      console.log("Metadata successfully uploaded to Arweave:", metadataUri);
    } catch (uploadError) {
      console.error("Failed to upload metadata to Arweave:", uploadError);
      throw new Error(`Metadata upload failed: ${uploadError.message}`);
    }
    
    console.log("Creating NFT transaction for Solana devnet...");
    
    // Create the NFT transaction - using standard NFT for maximum compatibility
    let tx;
    try {
      tx = await createNft(umi, {
        mint: nftMint,
        name: playerData.name,
        symbol: '5VS5',
        uri: metadataUri,
        sellerFeeBasisPoints: percentAmount(5), // 5% royalty
      });
    } catch (txError) {
      console.error("Failed to create NFT transaction:", txError);
      throw new Error(`Transaction creation failed: ${txError.message}`);
    }
    
    console.log("Sending transaction to Solana devnet...");
    console.log("This will trigger a wallet approval request. Please approve in your wallet.");
    
    // Send and confirm the transaction
    let result;
    try {
      result = await tx.sendAndConfirm(umi, {
        // Confirmation options
        commitment: 'confirmed',
        maxRetries: 3
      });
      console.log("Transaction successfully confirmed on devnet:", result.signature);
    } catch (confirmError) {
      console.error("Transaction failed or was rejected:", confirmError);
      throw new Error(`Transaction failed: ${confirmError.message}`);
    }
    
    return {
      mint: nftMint.publicKey,
      metadataUri,
      signature: result.signature
    };
  } catch (error) {
    console.error('Error creating player NFT on devnet:', error);
    throw error;
  }
};

// Get Solana Explorer URL
export const getExplorerUrl = (mintAddress, cluster = 'devnet') => {
  return `https://explorer.solana.com/address/${mintAddress}?cluster=${cluster}`;
};