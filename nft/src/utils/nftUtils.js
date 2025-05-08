// src/utils/nftUtils.js
import { 
  createNft, 
  mplTokenMetadata, 
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { 
  generateSigner, 
  signerIdentity, 
  percentAmount, 
  publicKey
} from "@metaplex-foundation/umi";

// Create a wallet adapter signer
const createWalletAdapterSigner = (walletAdapter) => {
  if (!walletAdapter.publicKey) {
    throw new Error('Wallet not connected');
  }

  return {
    publicKey: publicKey(walletAdapter.publicKey.toBase58()),
    signMessage: async (message) => {
      return await walletAdapter.signMessage(message);
    },
    signTransaction: async (transaction) => {
      return await walletAdapter.signTransaction(transaction);
    },
    signAllTransactions: async (transactions) => {
      return await walletAdapter.signAllTransactions(transactions);
    },
  };
};

// Initialize Umi
export const initializeUmi = (connection, walletAdapter) => {
  const umi = createUmi(connection.rpcEndpoint)
    .use(mplTokenMetadata())
    .use(irysUploader({ address: 'https://devnet.irys.xyz' }));
  
  if (walletAdapter && walletAdapter.publicKey) {
    const signer = createWalletAdapterSigner(walletAdapter);
    umi.use(signerIdentity(signer));
  }
  
  return umi;
};

// Create a simple player NFT
export const createPlayerNFT = async (umi, playerData) => {
  try {
    // Create a new mint
    const nftMint = generateSigner(umi);
    
    // Prepare player attributes for metadata
    const attributes = [
      { trait_type: 'Position', value: playerData.position },
      { trait_type: 'Mechanical', value: playerData.mechanical.toString() },
      { trait_type: 'Game Knowledge', value: playerData.gameKnowledge.toString() },
      { trait_type: 'Team Communication', value: playerData.teamCommunication.toString() },
    ];
    
    // Create metadata
    const metadata = {
      name: playerData.name,
      symbol: '5VS5',
      description: `${playerData.name} - ${playerData.position} player for 5VS5dotGG`,
      image: 'https://arweave.net/placeholder-image-uri',
      attributes: attributes
    };
    
    // Upload metadata
    const metadataUri = await umi.uploader.uploadJson(metadata);
    
    // Create NFT
    const tx = await createNft(umi, {
      mint: nftMint,
      name: playerData.name,
      symbol: '5VS5',
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(5), // 5% royalty
    });
    
    // Send transaction
    const result = await tx.sendAndConfirm(umi);
    
    return {
      mint: nftMint.publicKey,
      metadataUri,
      signature: result.signature
    };
  } catch (error) {
    console.error('Error creating NFT:', error);
    throw error;
  }
};

// Get Solana Explorer URL
export const getExplorerUrl = (mintAddress, cluster = 'devnet') => {
  return `https://explorer.solana.com/address/${mintAddress}?cluster=${cluster}`;
};