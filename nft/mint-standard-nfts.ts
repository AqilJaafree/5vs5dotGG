// mint-standard-nfts.ts
import { 
  createNft,
  verifyCollectionV1,
  findMetadataPda,
  findMasterEditionPda
} from '@metaplex-foundation/mpl-token-metadata';
import {
  createGenericFile,
  generateSigner,
  keypairIdentity,
  createSignerFromKeypair,
  sol,
  percentAmount,
  PublicKey,
  none,
  some
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { base58 } from '@metaplex-foundation/umi/serializers';
import fs from 'fs';

// Configuration
const TOTAL_NFTS = 5; // Start with 5 NFTs
const WALLET_PATH = '/home/wanaqil/devnet-wallet.json';
const POSITIONS = ['Top Lane', 'Mid Lane', 'Bot Lane', 'Jungler', 'Support'];
const CLASSES = ['Tank', 'Assassin', 'Mage', 'Marksman', 'Support'];

// Generate attributes
const generateAttributes = () => ({
  mechanical: Math.floor(Math.random() * 40) + 60, 
  gameKnowledge: Math.floor(Math.random() * 40) + 60,
  teamCommunication: Math.floor(Math.random() * 40) + 60,
  adaptability: Math.floor(Math.random() * 40) + 60,
  consistency: Math.floor(Math.random() * 40) + 60,
  form: Math.floor(Math.random() * 40) + 60,
  potential: Math.floor(Math.random() * 40) + 60,
});

async function mintStandardNfts() {
  console.log("Starting standard NFT minting process for 5VS5dotGG...");
  
  // Setup UMI with your wallet
  console.log(`Loading wallet from ${WALLET_PATH}`);
  const keypairData = JSON.parse(fs.readFileSync(WALLET_PATH, 'utf-8'));
  const secretKey = Uint8Array.from(keypairData);
  
  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplTokenMetadata())
    .use(irysUploader({ address: 'https://devnet.irys.xyz' }));
  
  const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  const signer = createSignerFromKeypair(umi, keypair);
  umi.use(keypairIdentity(signer));
  
  console.log(`Using wallet: ${signer.publicKey}`);
  
  // Check balance
  const balance = await umi.rpc.getBalance(signer.publicKey);
  console.log(`Wallet balance: ${Number(balance.basisPoints) / 1e9} SOL`);
  
  // Upload image
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
  
  // Create collection first
  console.log("\nCreating collection NFT...");
  
  // Collection metadata
  const collectionMetadata = {
    name: "5VS5 Players Collection",
    description: "Collection of player NFTs for 5VS5dotGG game",
    image: imageUri,
    external_url: "https://example.com/5vs5",
  };
  
  // Upload collection metadata
  console.log("Uploading collection metadata...");
  const collectionMetadataUri = await umi.uploader.uploadJson(collectionMetadata);
  
  // Create collection NFT
  const collectionMint = generateSigner(umi);
  
  // Find PDAs directly using the helper functions
  const collectionMetadataPda = findMetadataPda(umi, { mint: collectionMint.publicKey });
  const collectionMasterEditionPda = findMasterEditionPda(umi, { mint: collectionMint.publicKey });
  
  await createNft(umi, {
    mint: collectionMint,
    name: collectionMetadata.name,
    uri: collectionMetadataUri,
    sellerFeeBasisPoints: percentAmount(0), // 0% royalties
    isCollection: true,
  }).sendAndConfirm(umi);
  
  console.log(`Collection NFT created: ${collectionMint.publicKey}`);
  console.log(`Explorer: https://explorer.solana.com/address/${collectionMint.publicKey}?cluster=devnet`);
  
  // Start minting player NFTs
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
      
      // Create the NFT with collection
      const nftMint = generateSigner(umi);
      
      // Find NFT PDAs
      const nftMetadataPda = findMetadataPda(umi, { mint: nftMint.publicKey });
      const nftMasterEditionPda = findMasterEditionPda(umi, { mint: nftMint.publicKey });
      
      console.log(`Minting NFT to blockchain...`);
      
      // Create NFT
      await createNft(umi, {
        mint: nftMint,
        name: metadata.name,
        uri: metadataUri,
        sellerFeeBasisPoints: percentAmount(0),
        collection: some({
          verified: false,
          key: collectionMint.publicKey,
        }),
      }).sendAndConfirm(umi);
      
      // Verify collection membership
      console.log(`Verifying collection membership...`);
      await verifyCollectionV1(umi, {
        metadata: nftMetadataPda,
        collectionMint: collectionMint.publicKey,
        authority: signer,
        collectionMetadata: collectionMetadataPda,
        collectionMasterEdition: collectionMasterEditionPda,
      }).sendAndConfirm(umi);
      
      console.log(`✅ NFT created and verified!`);
      console.log(`Mint address: ${nftMint.publicKey}`);
      console.log(`Explorer: https://explorer.solana.com/address/${nftMint.publicKey}?cluster=devnet`);
      
      // Store in our results
      mintedNfts.push({
        mint: nftMint.publicKey.toString(),
        name: metadata.name,
        position: playerPosition,
        class: playerClass,
        attributes: playerAttributes,
      });
      
      // Short delay between mints
      await new Promise(r => setTimeout(r, 2000));
      
    } catch (error) {
      console.error(`Error creating NFT ${i+1}:`, error);
      console.error(error);
    }
  }
  
  // Save results to file
  if (mintedNfts.length > 0) {
    fs.writeFileSync(
      'standard-game-nfts.json',
      JSON.stringify({
        collection: collectionMint.publicKey.toString(),
        nfts: mintedNfts
      }, null, 2)
    );
    console.log(`\n🎮 Successfully minted ${mintedNfts.length} game NFTs in collection!`);
    console.log(`NFT details saved to standard-game-nfts.json`);
    console.log(`\nView collection: https://explorer.solana.com/address/${collectionMint.publicKey}?cluster=devnet`);
    console.log(`View first NFT: https://explorer.solana.com/address/${mintedNfts[0].mint}?cluster=devnet`);
  } else {
    console.log("\n❌ No NFTs were minted successfully");
  }
}

// Run the minting process
mintStandardNfts().catch(console.error);