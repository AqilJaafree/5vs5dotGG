import { PublicKey, Keypair } from "@solana/web3.js";
import {
    InitializeNewWorld,
    AddEntity, 
    InitializeComponent,
    ApplySystem,
    Program
} from "@magicblock-labs/bolt-sdk";
import { expect } from "chai";
import * as anchor from "@coral-xyz/anchor";

// Import Metaplex Umi
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { 
  createProgrammableNft,
  mplTokenMetadata,
  TokenStandard 
} from '@metaplex-foundation/mpl-token-metadata';
import { 
  createGenericFile,
  generateSigner,
  percentAmount,
  publicKey,
  signerIdentity,
  sol,
  keypairIdentity,
  createSignerFromKeypair
} from '@metaplex-foundation/umi';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { base58 } from '@metaplex-foundation/umi/serializers';
import fs from 'fs';
import path from 'path';

describe("5VS5dotGG - Team-Based Staking with Metaplex NFTs", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Umi instance
  let umi;

  // Test state
  let worldPda: PublicKey;
  let collectionNftMint;
  
  // Actor keypairs
  let creator1: Keypair;
  let creator2: Keypair;
  let player1: Keypair;
  let player2: Keypair;
  
  // NFT mints and signers
  let creatorPlayer1Mint;
  let creatorPlayer2Mint;
  let creatorPlayer1Signer;
  let creatorPlayer2Signer;
  
  // Entities
  let creatorPlayer1Entity: PublicKey;
  let creatorPlayer2Entity: PublicKey;
  let team1Entity: PublicKey;
  let teamStake1Entity: PublicKey;
  
  // Component PDAs
  let player1StatsComponentPda: PublicKey;
  let player2StatsComponentPda: PublicKey;
  let team1DataComponentPda: PublicKey;
  let teamStake1ComponentPda: PublicKey;
  let creator1RevenueComponentPda: PublicKey;

  // Programs
  const playerStatsComponent = anchor.workspace.PlayerStats;
  const teamDataComponent = anchor.workspace.TeamData;
  const teamStakeComponent = anchor.workspace.TeamStake;
  const creatorRevenueComponent = anchor.workspace.CreatorRevenue;
  const matchSystem = anchor.workspace.MatchSystem;
  const teamSystem = anchor.workspace.TeamSystem;
  const revenueSystem = anchor.workspace.RevenueSystem;

  before(async () => {
    // Setup Umi
    umi = createUmi("https://api.devnet.solana.com")
      .use(mplTokenMetadata())
      .use(irysUploader({
        address: "https://devnet.irys.xyz",
      }));
    
    // Setup keypairs
    creator1 = Keypair.generate();
    creator2 = Keypair.generate();
    player1 = Keypair.generate();
    player2 = Keypair.generate();
    
    // Convert keypairs to Umi signers
    const creator1Signer = createSignerFromKeypair(umi, creator1);
    const player1Signer = createSignerFromKeypair(umi, player1);
    
    // Airdrop SOL
    await Promise.all([
      provider.connection.requestAirdrop(creator1.publicKey, 5 * anchor.web3.LAMPORTS_PER_SOL),
      provider.connection.requestAirdrop(player1.publicKey, 5 * anchor.web3.LAMPORTS_PER_SOL),
      umi.rpc.airdrop(creator1Signer.publicKey, sol(2)),
      umi.rpc.airdrop(player1Signer.publicKey, sol(2)),
    ]);
    
    // Wait for confirmations
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  it("Initialize Game World", async () => {
    const initNewWorld = await InitializeNewWorld({
      payer: provider.wallet.publicKey,
      connection: provider.connection,
    });
    const txSign = await provider.sendAndConfirm(initNewWorld.transaction);
    worldPda = initNewWorld.worldPda;
    console.log(`Initialized 5VS5dotGG game world. Signature: ${txSign}`);
  });

  it("Create NFT Collection", async () => {
    // Use Admin (provider wallet) to create collection
    const adminUmi = umi.use(keypairIdentity(Keypair.fromSecretKey(
      Buffer.from(JSON.parse(fs.readFileSync(
        process.env.ANCHOR_WALLET || path.join(process.env.HOME, '.config/solana/id.json'), 
        'utf-8'
      )))
    )));
    
    // Create collection NFT signer
    const collectionNftSigner = generateSigner(adminUmi);
    
    // Create sample metadata for collection
    const collectionMetadata = {
      name: "5VS5dotGG Collection",
      description: "Esports Player Collection for 5VS5dotGG Game",
      image: "https://arweave.net/placeholder-collection-uri",
      external_url: "https://5vs5dotgg.io",
    };
    
    // Upload metadata
    const collectionMetadataUri = await adminUmi.uploader.uploadJson(collectionMetadata);
    
    // Create collection NFT
    const createCollectionTx = await createProgrammableNft(adminUmi, {
      mint: collectionNftSigner,
      name: collectionMetadata.name,
      uri: collectionMetadataUri,
      sellerFeeBasisPoints: percentAmount(5),
      isCollection: true,
    }).sendAndConfirm(adminUmi);
    
    collectionNftMint = collectionNftSigner.publicKey;
    console.log(`Created NFT Collection: ${collectionNftMint}`);
  });

  it("Creator creates NFT players", async () => {
    // Setup Umi with creator identity
    const creatorUmi = umi.use(keypairIdentity(creator1));
    
    // Create NFT signer
    creatorPlayer1Signer = generateSigner(creatorUmi);
    
    // Prepare sample metadata
    const playerMetadata = {
      name: "Pro Midlaner #1",
      description: "5VS5dotGG Pro Player NFT - Midlane Specialist",
      image: "https://arweave.net/placeholder-player-uri",
      external_url: "https://5vs5dotgg.io/players/1",
      attributes: [
        { trait_type: "Position", value: "Midlane" },
        { trait_type: "Mechanical", value: "90" },
        { trait_type: "Game Knowledge", value: "85" },
        { trait_type: "Team Communication", value: "80" },
        { trait_type: "Adaptability", value: "75" },
        { trait_type: "Consistency", value: "85" },
      ],
    };
    
    // Upload metadata
    const playerMetadataUri = await creatorUmi.uploader.uploadJson(playerMetadata);
    
    // Create programmable NFT
    const createNftTx = await createProgrammableNft(creatorUmi, {
      mint: creatorPlayer1Signer,
      name: playerMetadata.name,
      uri: playerMetadataUri,
      sellerFeeBasisPoints: percentAmount(10),
      collection: collectionNftMint,
      tokenStandard: TokenStandard.ProgrammableNonFungible,
    }).sendAndConfirm(creatorUmi);
    
    creatorPlayer1Mint = creatorPlayer1Signer.publicKey;
    console.log(`Creator created NFT player: ${creatorPlayer1Mint}`);
    
    // Create Bolt entity for player NFT
    const entity1 = await AddEntity({
      payer: creator1.publicKey,
      world: worldPda,
      connection: provider.connection,
    });
    
    creatorPlayer1Entity = entity1.entityPda;
    
    // Initialize player stats component
    const initStats1 = await InitializeComponent({
      payer: creator1.publicKey,
      entity: creatorPlayer1Entity,
      componentId: playerStatsComponent.programId,
    });
    
    player1StatsComponentPda = initStats1.componentPda;
    
    // Set player stats in Bolt
    await playerStatsComponent.methods
      .initializeStats({
        nftMint: new PublicKey(creatorPlayer1Mint.toString()),
        role: "Midlaner",
        mechanical: 90,
        gameKnowledge: 85,
        teamCommunication: 80,
        adaptability: 75,
        consistency: 85,
        form: 90,
        potential: 95,
      })
      .accounts({
        component: player1StatsComponentPda,
        authority: creator1.publicKey,
      })
      .signers([creator1])
      .rpc();
    
    // Initialize creator revenue component
    const initRevenue1 = await InitializeComponent({
      payer: creator1.publicKey,
      entity: creatorPlayer1Entity,
      componentId: creatorRevenueComponent.programId,
    });
    
    creator1RevenueComponentPda = initRevenue1.componentPda;
    await creatorRevenueComponent.methods
      .initialize({
        creator: creator1.publicKey,
        nftMint: new PublicKey(creatorPlayer1Mint.toString()),
      })
      .accounts({
        component: creator1RevenueComponentPda,
        authority: creator1.publicKey,
      })
      .signers([creator1])
      .rpc();
    
    console.log("Created NFT player entity in Bolt");
  });

  it("Transfer NFT to player", async () => {
    // Setup creator and player Umi instances
    const creatorUmi = umi.use(keypairIdentity(creator1));
    
    // Transfer NFT to player
    // Note: In a real implementation, this would typically happen via marketplace
    // This is simplifying the transfer for testing purposes
    const transferInstructions = await creatorUmi.programs.getTransferPnft({
      mint: creatorPlayer1Mint,
      authority: creator1.publicKey,
      destination: player1.publicKey,
      amount: 1,
    });
    
    // Execute transfer
    await transferInstructions.sendAndConfirm(creatorUmi);
    
    console.log(`NFT transferred to player: ${player1.publicKey.toString()}`);
  });

  it("Player creates team with SOL stake", async () => {
    // Create team entity
    const teamEntity = await AddEntity({
      payer: player1.publicKey,
      world: worldPda,
      connection: provider.connection,
    });
    
    team1Entity = teamEntity.entityPda;
    
    // Initialize team data component
    const initTeamData = await InitializeComponent({
      payer: player1.publicKey,
      entity: team1Entity,
      componentId: teamDataComponent.programId,
    });
    
    team1DataComponentPda = initTeamData.componentPda;
    
    // Create team stake entity
    const stakeEntity = await AddEntity({
      payer: player1.publicKey,
      world: worldPda,
      connection: provider.connection,
    });
    
    teamStake1Entity = stakeEntity.entityPda;
    
    // Initialize team stake component
    const initStake = await InitializeComponent({
      payer: player1.publicKey,
      entity: teamStake1Entity,
      componentId: teamStakeComponent.programId,
    });
    
    teamStake1ComponentPda = initStake.componentPda;
    
    // Stake SOL to create team
    const stakeAmount = 1 * anchor.web3.LAMPORTS_PER_SOL; // 1 SOL
    
    const createTeam = await ApplySystem({
      authority: player1.publicKey,
      systemId: teamSystem.programId,
      world: worldPda,
      entities: [
        {
          entity: team1Entity,
          components: [{ componentId: teamDataComponent.programId }],
        },
        {
          entity: teamStake1Entity,
          components: [{ componentId: teamStakeComponent.programId }],
        }
      ],
      args: JSON.stringify({
        action: "createTeamWithStake",
        teamName: "Dragon Slayers",
        stakeAmount: stakeAmount,
      })
    });
    
    await provider.sendAndConfirm(createTeam.transaction, [player1]);
    
    // Verify team creation
    const teamData = await teamDataComponent.account.teamData.fetch(
      team1DataComponentPda
    );
    
    expect(teamData.name).to.equal("Dragon Slayers");
    
    console.log(`Team created with ${stakeAmount / anchor.web3.LAMPORTS_PER_SOL} SOL stake`);
  });

  it("Player adds NFT to team", async () => {
    // Add owned NFT to team
    const addPlayer = await ApplySystem({
      authority: player1.publicKey,
      systemId: teamSystem.programId,
      world: worldPda,
      entities: [
        {
          entity: team1Entity,
          components: [{ componentId: teamDataComponent.programId }],
        },
        {
          entity: creatorPlayer1Entity,
          components: [{ componentId: playerStatsComponent.programId }],
        }
      ],
      args: JSON.stringify({
        action: "addPlayerToTeam",
        playerNftMint: new PublicKey(creatorPlayer1Mint.toString()),
        position: "Midlaner",
      })
    });
    
    await provider.sendAndConfirm(addPlayer.transaction, [player1]);
    
    // Verify player added
    const teamData = await teamDataComponent.account.teamData.fetch(
      team1DataComponentPda
    );
    
    expect(teamData.roster.length).to.equal(1);
    expect(teamData.roster[0].nftMint.toString()).to.equal(creatorPlayer1Mint.toString());
    
    console.log("Player added to team");
  });

  it("Select strategy and schedule match", async () => {
    // Select strategy
    const selectStrategy = await ApplySystem({
      authority: player1.publicKey,
      systemId: teamSystem.programId,
      world: worldPda,
      entities: [{
        entity: team1Entity,
        components: [{ componentId: teamDataComponent.programId }],
      }],
      args: JSON.stringify({
        action: "setStrategy",
        strategy: {
          type: "Aggro",
          description: "Punch fast and hard early",
        }
      })
    });
    
    await provider.sendAndConfirm(selectStrategy.transaction, [player1]);
    
    // For the sake of the test, let's create a mock opponent team
    const opponentTeam = await AddEntity({
      payer: provider.wallet.publicKey,
      world: worldPda,
      connection: provider.connection,
    });
    
    const initOpponentTeam = await InitializeComponent({
      payer: provider.wallet.publicKey,
      entity: opponentTeam.entityPda,
      componentId: teamDataComponent.programId,
    });
    
    await teamDataComponent.methods
      .initialize({
        name: "Mock Opponent",
        owner: provider.wallet.publicKey,
      })
      .accounts({
        component: initOpponentTeam.componentPda,
        authority: provider.wallet.publicKey,
      })
      .rpc();
    
    // Schedule match
    const scheduleMatch = await ApplySystem({
      authority: player1.publicKey,
      systemId: matchSystem.programId,
      world: worldPda,
      entities: [
        {
          entity: team1Entity,
          components: [{ componentId: teamDataComponent.programId }],
        },
        {
          entity: opponentTeam.entityPda,
          components: [{ componentId: teamDataComponent.programId }],
        }
      ],
      args: JSON.stringify({
        action: "scheduleMatch",
        matchType: "friendly",
      })
    });
    
    await provider.sendAndConfirm(scheduleMatch.transaction, [player1]);
    console.log("Strategy selected and match scheduled");
  });

  it("Simulate match and distribute revenue", async () => {
    // Simulate the previously scheduled match
    const matchId = "match-" + Date.now().toString();
    
    const simulateMatch = await ApplySystem({
      authority: provider.wallet.publicKey,
      systemId: matchSystem.programId,
      world: worldPda,
      entities: [
        {
          entity: team1Entity,
          components: [{ componentId: teamDataComponent.programId }],
        }
      ],
      args: JSON.stringify({
        action: "simulateMatch",
        matchId: matchId,
      })
    });
    
    await provider.sendAndConfirm(simulateMatch.transaction);
    
    // Distribute revenue - 60% to creators, 40% to developers
    const matchFee = 0.1 * anchor.web3.LAMPORTS_PER_SOL; // 0.1 SOL
    
    const distributeRevenue = await ApplySystem({
      authority: provider.wallet.publicKey,
      systemId: revenueSystem.programId,
      world: worldPda,
      entities: [
        {
          entity: creatorPlayer1Entity,
          components: [{ componentId: creatorRevenueComponent.programId }],
        }
      ],
      args: JSON.stringify({
        action: "distributeMatchRevenue",
        matchId: matchId,
        totalFees: matchFee,
      })
    });
    
    await provider.sendAndConfirm(distributeRevenue.transaction);
    
    // Check creator revenue
    const creatorRevenue = await creatorRevenueComponent.account.creatorRevenue.fetch(
      creator1RevenueComponentPda
    );
    
    // Creator should get 60% of match fee
    expect(creatorRevenue.totalEarned.toNumber()).to.be.gt(0);
    
    console.log(`Match completed with ${matchFee / anchor.web3.LAMPORTS_PER_SOL} SOL fees`);
    console.log(`Creator earned ${creatorRevenue.totalEarned.toNumber() / anchor.web3.LAMPORTS_PER_SOL} SOL`);
  });

  it("Player unstakes from team", async () => {
    // Unstake from team
    const unstake = await ApplySystem({
      authority: player1.publicKey,
      systemId: teamSystem.programId,
      world: worldPda,
      entities: [
        {
          entity: team1Entity,
          components: [{ componentId: teamDataComponent.programId }],
        },
        {
          entity: teamStake1Entity,
          components: [{ componentId: teamStakeComponent.programId }],
        }
      ],
      args: JSON.stringify({
        action: "unstakeFromTeam",
      })
    });
    
    await provider.sendAndConfirm(unstake.transaction, [player1]);
    
    // Verify unstaking
    const stakeData = await teamStakeComponent.account.teamStake.fetch(
      teamStake1ComponentPda
    );
    
    expect(stakeData.stakedAmount.toNumber()).to.equal(0);
    
    console.log("Player unstaked SOL from team");
  });
});