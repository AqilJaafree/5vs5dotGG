# 5VS5dotGG NFT Enhancement Guide

This guide outlines the process for enhancing the 5VS5dotGG NFT ecosystem, enabling a more immersive gaming experience with custom player images, advanced trading mechanisms, and on-chain attribute progression.

## Table of Contents
- [Customized Player Visuals](#customized-player-visuals)
- [Player Trading System](#player-trading-system)
- [Dynamic Attribute Updates](#dynamic-attribute-updates)
- [Scaling the NFT Ecosystem](#scaling-the-nft-ecosystem)
- [Integration With Game Systems](#integration-with-game-systems)

## Customized Player Visuals

### Overview
Replace the uniform placeholder images with class-specific player art to visually distinguish player roles and classes.

### Implementation Steps

1. **Create Class-Specific Artwork**
   ```bash
   # Directory structure for player images
   mkdir -p player-assets/{tank,assassin,mage,marksman,support}
   ```

2. **Update NFT Minting Script**
   ```typescript
   // Select appropriate image based on class
   const getImageForClass = (playerClass) => {
     const classImagesMap = {
       'Tank': fs.readFileSync('./player-assets/tank/player.jpg'),
       'Assassin': fs.readFileSync('./player-assets/assassin/player.jpg'),
       'Mage': fs.readFileSync('./player-assets/mage/player.jpg'),
       'Marksman': fs.readFileSync('./player-assets/marksman/player.jpg'),
       'Support': fs.readFileSync('./player-assets/support/player.jpg'),
     };
     
     return classImagesMap[playerClass] || fs.readFileSync('./player-assets/default.jpg');
   };
   
   // During NFT creation
   const playerImage = getImageForClass(playerClass);
   const genericFile = createGenericFile(playerImage, `${playerClass.toLowerCase()}.jpg`, {
     tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
   });
   ```

3. **Run Updated Minting Script**
   ```bash
   pnpm run mint-custom-images
   ```

## Player Trading System

### Overview
Implement a mechanism for transferring NFT players between wallets, simulating real player trading and team management.

### Implementation Steps

1. **Create Transfer Script**
   ```typescript
   // transfer-player.ts
   import { publicKey, token } from '@metaplex-foundation/umi';
   import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
   import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
   
   async function transferNft(fromKeypair, toWalletAddress, mintAddress) {
     // Initialize Umi with the sender's keypair
     const umi = createUmi('https://api.devnet.solana.com')
       .use(mplTokenMetadata());
     
     // Load sender keypair
     const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync(fromKeypair, 'utf-8')));
     const senderKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
     umi.use(keypairIdentity(senderKeypair));
     
     // Convert addresses to UMI format
     const mintPubkey = publicKey(mintAddress);
     const recipientPubkey = publicKey(toWalletAddress);
     
     // Transfer the NFT
     await token.sendAndConfirmTransfer(umi, {
       source: await token.findAssociatedTokenAccount(umi, {
         mint: mintPubkey,
         owner: senderKeypair.publicKey,
       }),
       destination: await token.findAssociatedTokenAccount(umi, {
         mint: mintPubkey,
         owner: recipientPubkey,
       }),
       amount: token.amount(1),
     });
     
     console.log(`NFT ${mintAddress} transferred to ${toWalletAddress}`);
   }
   ```

2. **Example Usage Script**
   ```bash
   # Script to transfer a specific NFT
   node --loader ts-node/esm scripts/transfer-player.js \
     --from /home/wanaqil/devnet-wallet.json \
     --to 8JUjWjn2zPTbCBZi5xWJAzCYXdmqag5cWzQvLJZPAuLg \
     --nft 3NGTLCXNSeSE33iGsCFHk7N22c63uyvT2CUrHTk2inyQ
   ```

3. **In-Game Transfer UI Integration**
   ```javascript
   async function initiatePlayerTransfer(nftMint, recipientAddress) {
     try {
       // Create transaction to transfer NFT
       const tx = await program.methods
         .transferNft(nftMint, recipientAddress)
         .accounts({
           // Required accounts
         })
         .transaction();
         
       // Sign and send the transaction
       const signature = await wallet.sendTransaction(tx, connection);
       
       // Update UI
       console.log(`Transfer submitted: ${signature}`);
       return signature;
     } catch (error) {
       console.error('Transfer failed:', error);
       throw error;
     }
   }
   ```

## Dynamic Attribute Updates

### Overview
Implement a system to update player attributes on-chain after matches, reflecting player development and performance changes.

### Implementation Steps

1. **Create Attribute Update Script**
   ```typescript
   // update-player-attributes.ts
   import { findMetadataPda } from '@metaplex-foundation/mpl-token-metadata';
   
   async function updatePlayerForm(nftMint, newFormValue) {
     // Initialize player stats component update
     await playerStatsComponent.methods
       .updateForm(newFormValue)
       .accounts({
         component: playerStatsComponentPda,
         authority: wallet.publicKey,
       })
       .rpc();
     
     console.log(`Updated player form to ${newFormValue}`);
   }
   
   async function updatePlayerAfterMatch(nftMint, matchResult, performanceScore) {
     // Calculate form adjustment based on performance
     const formAdjustment = matchResult.win ? 
       Math.min(5, performanceScore) : 
       Math.max(-5, -performanceScore);
     
     // Get current player stats
     const playerStats = await playerStatsComponent.account.playerStats.fetch(
       playerStatsComponentPda
     );
     
     // Calculate new form value (ensuring it stays between 0-100)
     const newForm = Math.max(0, Math.min(100, playerStats.form + formAdjustment));
     
     // Update the form
     await updatePlayerForm(nftMint, newForm);
     
     // Record match result
     await playerStatsComponent.methods
       .recordMatchResult(matchResult.win)
       .accounts({
         component: playerStatsComponentPda,
         authority: wallet.publicKey,
       })
       .rpc();
     
     console.log(`Updated player stats after match: Form=${newForm}, Win=${matchResult.win}`);
   }
   ```

2. **Integration with Match System**
   ```typescript
   // Within the match simulation system
   async function processMatchResults(matchId, team1Score, team2Score) {
     // Determine winners
     const team1Won = team1Score > team2Score;
     
     // For each player in team 1
     for (const player of team1Players) {
       // Calculate performance score (hypothetical)
       const performanceScore = calculatePlayerPerformance(player, matchId);
       
       // Update player attributes
       await updatePlayerAfterMatch(
         player.nftMint, 
         { win: team1Won, matchId }, 
         performanceScore
       );
     }
     
     // Repeat for team 2 players with inverted win result
     // ...
   }
   ```

## Scaling the NFT Ecosystem

### Overview
Expand the NFT player pool to support larger-scale testing and diverse team compositions.

### Implementation Steps

1. **Create Batch Minting Script**
   ```typescript
   // mint-batch-nfts.ts
   
   // Configuration
   const TOTAL_NFTS = 100; // Scale up to 100 NFTs
   const BATCH_SIZE = 10;  // Mint in batches of 10
   
   async function mintBatchNfts() {
     // Setup similar to previous scripts
     
     // Track all minted NFTs
     const allMintedNfts = [];
     
     // Process in batches
     for (let batchIndex = 0; batchIndex < Math.ceil(TOTAL_NFTS / BATCH_SIZE); batchIndex++) {
       const batchStart = batchIndex * BATCH_SIZE;
       const batchEnd = Math.min((batchIndex + 1) * BATCH_SIZE, TOTAL_NFTS);
       
       console.log(`Processing batch ${batchIndex + 1}: NFTs ${batchStart + 1} to ${batchEnd}`);
       
       // Create NFTs in this batch
       const batchNfts = await mintNftBatch(batchStart, batchEnd);
       allMintedNfts.push(...batchNfts);
       
       // Wait between batches to avoid rate limits
       if (batchIndex < Math.ceil(TOTAL_NFTS / BATCH_SIZE) - 1) {
         console.log('Waiting between batches...');
         await new Promise(resolve => setTimeout(resolve, 5000));
       }
     }
     
     // Save all NFT data
     fs.writeFileSync(
       'all-game-nfts.json',
       JSON.stringify({
         collection: collectionMint.publicKey.toString(),
         nfts: allMintedNfts
       }, null, 2)
     );
   }
   ```

2. **Generate More Diverse Attributes**
   ```typescript
   // Enhanced attribute generation for more diversity
   const generateAttributes = (playerClass, position) => {
     // Base attributes with some randomness
     const baseAttributes = {
       Tank: { mechanical: 60, gameKnowledge: 70, teamCommunication: 80 },
       Assassin: { mechanical: 85, gameKnowledge: 70, teamCommunication: 60 },
       Mage: { mechanical: 75, gameKnowledge: 85, teamCommunication: 65 },
       Marksman: { mechanical: 80, gameKnowledge: 65, teamCommunication: 70 },
       Support: { mechanical: 65, gameKnowledge: 80, teamCommunication: 90 },
     };
     
     // Position modifiers
     const positionModifiers = {
       'Top Lane': { adaptability: 10, consistency: 5 },
       'Mid Lane': { adaptability: 15, consistency: 0 },
       'Bot Lane': { adaptability: 5, consistency: 10 },
       'Jungler': { adaptability: 20, consistency: -5 },
       'Support': { adaptability: 10, consistency: 15 },
     };
     
     // Get base attributes for class
     const base = baseAttributes[playerClass] || { mechanical: 70, gameKnowledge: 70, teamCommunication: 70 };
     
     // Get modifiers for position
     const mods = positionModifiers[position] || { adaptability: 10, consistency: 10 };
     
     // Apply randomness (±10)
     const randomize = (value) => Math.max(50, Math.min(100, value + Math.floor(Math.random() * 21) - 10));
     
     return {
       mechanical: randomize(base.mechanical),
       gameKnowledge: randomize(base.gameKnowledge),
       teamCommunication: randomize(base.teamCommunication),
       adaptability: randomize(70 + mods.adaptability),
       consistency: randomize(70 + mods.consistency),
       form: randomize(75), // Current form starts at ~75
       potential: randomize(80), // Potential starts at ~80
     };
   };
   ```

## Integration With Game Systems

### Overview
Connect the NFT system with the game's core mechanics for a seamless experience.

### Implementation Steps

1. **Create Player Registration System**
   ```typescript
   // register-nft-with-game.ts
   
   async function registerNftWithGame(nftMint) {
     // Create Bolt entity
     const entity = await AddEntity({
       payer: wallet.publicKey,
       world: worldPda,
       connection: connection,
     });
     
     // Initialize player stats component
     const playerStatsComponent = await InitializeComponent({
       payer: wallet.publicKey,
       entity: entity.entityPda,
       componentId: playerStatsComponentProgramId,
     });
     
     // Fetch NFT metadata
     const metadata = await getMetadata(connection, new PublicKey(nftMint));
     
     // Parse attributes from metadata
     const attributes = parseAttributesFromMetadata(metadata);
     
     // Initialize stats with values from NFT
     await playerStatsComponent.methods
       .initializeStats({
         nftMint: new PublicKey(nftMint),
         role: attributes.position,
         mechanical: attributes.mechanical,
         gameKnowledge: attributes.gameKnowledge,
         teamCommunication: attributes.teamCommunication,
         adaptability: attributes.adaptability,
         consistency: attributes.consistency,
         form: attributes.form,
         potential: attributes.potential,
       })
       .accounts({
         component: playerStatsComponent.componentPda,
         authority: wallet.publicKey,
       })
       .rpc();
     
     return {
       entityId: entity.entityPda.toString(),
       componentId: playerStatsComponent.componentPda.toString(),
       nftMint,
       attributes
     };
   }
   ```

2. **Create Team Formation Interface**
   ```typescript
   // team-formation.ts
   
   async function createTeamFromNfts(teamName, nftMints) {
     // Create team entity
     const teamEntity = await AddEntity({
       payer: wallet.publicKey,
       world: worldPda,
       connection: connection,
     });
     
     // Initialize team data component
     const teamDataComponent = await InitializeComponent({
       payer: wallet.publicKey,
       entity: teamEntity.entityPda,
       componentId: teamDataComponentProgramId,
     });
     
     // Initialize team
     await teamDataComponent.methods
       .initialize(teamName, wallet.publicKey)
       .accounts({
         component: teamDataComponent.componentPda,
         authority: wallet.publicKey,
       })
       .rpc();
     
     // Add players to team
     for (const nftMint of nftMints) {
       const metadata = await getMetadata(connection, new PublicKey(nftMint));
       const attributes = parseAttributesFromMetadata(metadata);
       
       await teamDataComponent.methods
         .addPlayer(new PublicKey(nftMint), attributes.position)
         .accounts({
           component: teamDataComponent.componentPda,
           authority: wallet.publicKey,
         })
         .rpc();
     }
     
     return {
       teamEntityId: teamEntity.entityPda.toString(),
       teamComponentId: teamDataComponent.componentPda.toString(),
       teamName,
       playerCount: nftMints.length
     };
   }
   ```

3. **Match Scheduling and Simulation**
   ```typescript
   // match-system.ts
   
   async function scheduleMatch(team1Id, team2Id, matchType = 'friendly') {
     // Apply system to schedule match
     const txSchedule = await ApplySystem({
       authority: wallet.publicKey,
       systemId: matchSystemProgramId,
       world: worldPda,
       entities: [
         {
           entity: new PublicKey(team1Id),
           components: [{ componentId: teamDataComponentProgramId }],
         },
         {
           entity: new PublicKey(team2Id),
           components: [{ componentId: teamDataComponentProgramId }],
         }
       ],
       args: JSON.stringify({
         action: "scheduleMatch",
         matchType,
       })
     });
     
     const scheduleSignature = await wallet.sendTransaction(txSchedule.transaction);
     console.log(`Match scheduled: ${scheduleSignature}`);
     
     return {
       team1Id,
       team2Id,
       matchType,
       scheduleTxSignature: scheduleSignature
     };
   }
   
   async function simulateMatch(matchInfo) {
     const { team1Id, team2Id } = matchInfo;
     const matchId = `match-${Date.now()}`;
     
     // Get all player entities for both teams
     const team1Players = await getTeamPlayerEntities(team1Id);
     const team2Players = await getTeamPlayerEntities(team2Id);
     
     // Build entities array for match simulation
     const entities = [
       {
         entity: new PublicKey(team1Id),
         components: [{ componentId: teamDataComponentProgramId }],
       },
       {
         entity: new PublicKey(team2Id),
         components: [{ componentId: teamDataComponentProgramId }],
       },
       // Add all player entities from both teams
       ...team1Players.map(p => ({
         entity: new PublicKey(p.entityId),
         components: [{ componentId: playerStatsComponentProgramId }],
       })),
       ...team2Players.map(p => ({
         entity: new PublicKey(p.entityId),
         components: [{ componentId: playerStatsComponentProgramId }],
       })),
     ];
     
     // Apply system to simulate match
     const txSimulate = await ApplySystem({
       authority: wallet.publicKey,
       systemId: matchSystemProgramId,
       world: worldPda,
       entities,
       args: JSON.stringify({
         action: "simulateMatch",
         matchId,
       })
     });
     
     const simulateSignature = await wallet.sendTransaction(txSimulate.transaction);
     console.log(`Match simulated: ${simulateSignature}`);
     
     return {
       matchId,
       team1Id,
       team2Id,
       simulateTxSignature: simulateSignature
     };
   }
   ```

---

By implementing these enhancements, you'll transform the 5VS5dotGG NFT system from a basic testing platform into a rich, interactive gaming experience with dynamic player development, trading mechanisms, and diverse visual representation.

The enhancements build upon the core NFT system you've already established, allowing for incremental development and testing while continually improving the player experience.