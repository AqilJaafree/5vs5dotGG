import { create } from '@metaplex-foundation/mpl-core';
import {
  createGenericFile,
  generateSigner,
  keypairIdentity,
  createSignerFromKeypair,
  sol,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCore } from '@metaplex-foundation/mpl-core';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { base58 } from '@metaplex-foundation/umi/serializers';
import fs from 'fs';

// Configuration
const TOTAL_NFTS = 5; // Start with 5 for first test
const WALLET_PATH = '/home/wanaqil/devnet-wallet.json';
const POSITIONS = ['Top Lane', 'Mid Lane', 'Bot Lane', 'Jungler', 'Support'];
const CLASSES = ['Tank', 'Assassin', 'Mage', 'Marksman', 'Support'];

// Generate random player attributes (60-99 range)
const generateAttributes = () => ({
  mechanical: Math.floor(Math.random() * 40) + 60, 
  gameKnowledge: Math.floor(Math.random() * 40) + 60,
  teamCommunication: Math.floor(Math.random() * 40) + 60,
  adaptability: Math.floor(Math.random() * 40) + 60,
  consistency: Math.floor(Math.random() * 40) + 60,
  form: Math.floor(Math.random() * 40) + 60,
  potential: Math.floor(Math.random() * 40) + 60,
});

async function mintGameNfts() {
  console.log("Starting NFT minting process for 5VS5dotGG...");
  
  // Setup UMI with your wallet
  console.log(`Loading wallet from ${WALLET_PATH}`);
  const keypairData = JSON.parse(fs.readFileSync(WALLET_PATH, 'utf-8'));
  const secretKey = Uint8Array.from(keypairData);
  
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplCore())
    .use(irysUploader({ address: 'https://devnet.irys.xyz' }));
  
  const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  const signer = createSignerFromKeypair(umi, keypair);
  umi.use(keypairIdentity(signer));
  
  console.log(`Using wallet: ${signer.publicKey}`);
  
  // Check balance
  const balance = await umi.rpc.getBalance(signer.publicKey);
  console.log(`Wallet balance: ${Number(balance.basisPoints) / 1e9} SOL`);
  
  // Create base image (simple placeholder if none exists)
  let imageUri;
  try {
    if (fs.existsSync('./player.jpg')) {
      console.log('Using existing player.jpg image');
      const imageFile = fs.readFileSync('./player.jpg');
      const genericFile = createGenericFile(imageFile, 'player.jpg', {
        tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
      });
      imageUri = (await umi.uploader.upload([genericFile]))[0];
    } else {
      console.log('No player image found, using placeholder');
      // Create a base64 encoded 1x1 pixel
      const placeholderData = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
        'base64'
      );
      fs.writeFileSync('./player.jpg', placeholderData);
      const genericFile = createGenericFile(placeholderData, 'player.jpg', {
        tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
      });
      imageUri = (await umi.uploader.upload([genericFile]))[0];
    }
    console.log(`Base image uploaded: ${imageUri}`);
  } catch (error) {
    console.error('Error uploading image:', error);
    return;
  }
  
  // Start minting NFTs
  const mintedNfts = [];
  
  for (let i = 0; i < TOTAL_NFTS; i++) {
    try {
      // Generate random attributes for this player
      const playerPosition = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
      const playerClass = CLASSES[Math.floor(Math.random() * CLASSES.length)];
      const playerAttributes = generateAttributes();
      
      console.log(`\nCreating NFT ${i+1}/${TOTAL_NFTS}: ${playerClass} - ${playerPosition}`);
      
      // Create metadata
      const metadata = {
        name: `5VS5 Player #${i + 1}`,
        description: `A ${playerClass} who specializes in ${playerPosition}`,
        image: imageUri,
        attributes: [
          { trait_type: 'Position', value: playerPosition },
          { trait_type: 'Class', value: playerClass },
          { trait_type: 'Mechanical', value: playerAttributes.mechanical.toString() },
          { trait_type: 'Game Knowledge', value: playerAttributes.gameKnowledge.toString() },
          { trait_type: 'Team Communication', value: playerAttributes.teamCommunication.toString() },
          { trait_type: 'Adaptability', value: playerAttributes.adaptability.toString() },
          { trait_type: 'Consistency', value: playerAttributes.consistency.toString() },
          { trait_type: 'Form', value: playerAttributes.form.toString() },
          { trait_type: 'Potential', value: playerAttributes.potential.toString() },
        ],
        properties: {
          files: [{ uri: imageUri, type: 'image/jpeg' }],
          category: 'image',
        },
      };
      
      // Upload metadata
      console.log(`Uploading metadata...`);
      const metadataUri = await umi.uploader.uploadJson(metadata);
      
      // Create the NFT
      const asset = generateSigner(umi);
      console.log(`Minting NFT to blockchain...`);
      const tx = await create(umi, {
        asset,
        name: metadata.name,
        uri: metadataUri,
      }).sendAndConfirm(umi);
      
      // Get transaction signature
      const signature = base58.deserialize(tx.signature)[0];
      
      console.log(`✅ NFT created!`);
      console.log(`Mint address: ${asset.publicKey}`);
      console.log(`Explorer: https://explorer.solana.com/address/${asset.publicKey}?cluster=devnet`);
      
      // Store in our results
      mintedNfts.push({
        mint: asset.publicKey.toString(),
        name: metadata.name,
        position: playerPosition,
        class: playerClass,
        attributes: playerAttributes,
        txSignature: signature,
      });
      
      // Short delay between mints
      await new Promise(r => setTimeout(r, 2000));
      
    } catch (error) {
      console.error(`Error creating NFT ${i+1}:`, error);
    }
  }
  
  // Save results to file
  if (mintedNfts.length > 0) {
    fs.writeFileSync(
      'game-nfts.json',
      JSON.stringify(mintedNfts, null, 2)
    );
    console.log(`\n🎮 Successfully minted ${mintedNfts.length} game NFTs!`);
    console.log(`NFT details saved to game-nfts.json`);
    console.log(`\nView all on Solana Explorer: https://explorer.solana.com/address/${mintedNfts[0].mint}?cluster=devnet`);
  } else {
    console.log("\n❌ No NFTs were minted successfully");
  }
}

// Run the minting process
mintGameNfts().catch(console.error);