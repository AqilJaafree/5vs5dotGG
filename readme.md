# 5VS5dotGG - Decentralized Esports Platform

A decentralized esports management platform built on Solana, enabling NFT-based team management and match simulation for competitive esports teams.

## Overview

5VS5dotGG is an innovative blockchain-based platform that combines NFT gaming with esports management. Teams, players, matches, and strategies are all represented on-chain using the Bolt Entity Component System (ECS) framework on Solana.

## Deployments

### Devnet Deployment

The project is currently deployed on Solana Devnet with the following program IDs:

| Program | Address |
|---------|---------|
| esport | `3h171djVn6LDR1JGHfMvg3HtZM96Vmjg95MJ4Zs5AFYg` |
| movement | `Fzx3eWPzsR5VCQsYjn5LsFeyLSRz7WsTJkByqbgVR6Mf` |
| position | `EXBnodEG8GnhJwipqupBMMk8Cd3CRdXEgrXCh7Jd9KNv` |
| player_stats | `5VLAaXmJsdUeV66WQJKvwGd3cLfsM5ETnN3PXC9ny1jh` |
| team_data | `D4xnj8Qd5vh7zZ2t5oVT78csuJUL1H5UbTxrC1bUutrN` |
| team_system | `EyqXcKHQ6dAEcKpCzrsMsoC87XtMjatsSNSKNNHC5C8R` |
| match_system | `ENQjWYERif38dvoXjqEJpzM2cYXgEq2VBzDeH1Rn2RAz` |
| match_queue | `CHUtz6R1YRSYVRf56i4jefH4EiLMGFTx4TuSXa9SfhAy` |
| Bolt World | `WorLD15A7CrDwLcLy4fRqtaTb9fbd8o8iqiEMUDse2n` |

You can view these programs on [Solana Explorer (Devnet)](https://explorer.solana.com/?cluster=devnet).

## Key Features

- **NFT Player Cards:** Players are represented as NFTs with unique attributes and statistics
- **Team Management:** Create teams, add players, set strategies, and compete
- **Match Simulation:** Automatic match simulation based on player stats and team strategy
- **On-chain History:** All match results and player statistics stored permanently on-chain
- **Revenue Sharing:** 60% of match fees go to NFT creators, 40% to platform

## Technical Architecture

The project uses the Bolt ECS (Entity Component System) framework, which separates:

1. **Entities:** Unique identifiers that represent game objects
2. **Components:** Data containers attached to entities
3. **Systems:** Logic that operates on components

### Core Components

- **PlayerStats:** Stores player attributes and performance statistics
- **TeamData:** Manages team composition, strategy, and match history
- **MatchQueue:** Handles pending matches between teams
- **Position:** Basic spatial component for coordinates

### Core Systems

- **TeamSystem:** Handles team creation, roster management, and strategy selection
- **MatchSystem:** Schedules and simulates matches between teams
- **Movement:** Basic entity movement functionality

## Player Attributes

Each NFT player has unique attributes that affect match performance:

| Attribute | Description | Range |
|-----------|-------------|-------|
| Mechanical | Technical skill level | 0-100 |
| Game Knowledge | Understanding of game mechanics | 0-100 |
| Team Communication | Ability to coordinate with teammates | 0-100 |
| Adaptability | Ability to adjust to changing conditions | 0-100 |
| Consistency | Reliability of performance | 0-100 |
| Form | Current performance level (fluctuates) | 0-100 |
| Potential | Long-term growth ceiling | 0-100 |

## Usage Flow

1. **Creator Flow:**
   - Mint NFT players with attributes
   - Earn revenue when their NFTs are used in matches

2. **Player Flow:**
   - Acquire NFT players (purchase, trade)
   - Create a team by staking SOL
   - Add NFTs to team roster
   - Select team strategy
   - Challenge other teams to matches
   - Matches are simulated on-chain
   - View results and stats
   - Improve team through better players/strategies
   - Optionally disband team to reclaim stake

## Getting Started

### Prerequisites

- Solana CLI
- Anchor Framework
- Rust
- Node.js and Yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/5vs5dotgg.git
   cd 5vs5dotgg
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Build the project:
   ```bash
   anchor build
   ```

### Connecting to Devnet Deployment

To interact with the deployed contracts on devnet:

1. Configure Solana CLI for devnet:
   ```bash
   solana config set --url https://api.devnet.solana.com
   ```

2. Update your Anchor.toml to include the devnet program IDs:
   ```toml
   [programs.devnet]
   esport = "3h171djVn6LDR1JGHfMvg3HtZM96Vmjg95MJ4Zs5AFYg"
   movement = "Fzx3eWPzsR5VCQsYjn5LsFeyLSRz7WsTJkByqbgVR6Mf"
   position = "EXBnodEG8GnhJwipqupBMMk8Cd3CRdXEgrXCh7Jd9KNv"
   player_stats = "5VLAaXmJsdUeV66WQJKvwGd3cLfsM5ETnN3PXC9ny1jh"
   team_data = "D4xnj8Qd5vh7zZ2t5oVT78csuJUL1H5UbTxrC1bUutrN"
   team_system = "EyqXcKHQ6dAEcKpCzrsMsoC87XtMjatsSNSKNNHC5C8R"
   match_system = "ENQjWYERif38dvoXjqEJpzM2cYXgEq2VBzDeH1Rn2RAz"
   match_queue = "CHUtz6R1YRSYVRf56i4jefH4EiLMGFTx4TuSXa9SfhAy"
   ```

3. Initialize Game World:
   ```javascript
   // Example code snippet
   const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
   const { InitializeNewWorld } = require('@magicblock-labs/bolt-sdk');
   const anchor = require('@coral-xyz/anchor');

   // Setup connection and wallet
   const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
   // Load your wallet
   const wallet = // your wallet setup

   // Initialize world
   const initNewWorld = await InitializeNewWorld({
     payer: wallet.publicKey,
     connection,
   });
   
   const txSign = await wallet.sendAndConfirm(initNewWorld.transaction);
   const worldPda = initNewWorld.worldPda;
   
   console.log(`World PDA: ${worldPda.toString()}`);
   // Save this World PDA for future interactions
   ```

4. Run the test suite against devnet:
   ```bash
   ANCHOR_PROVIDER_URL=https://api.devnet.solana.com anchor test --skip-build --skip-deploy --skip-local-validator
   ```w

## Client Side Integration

### Client applications need to:

Connect Wallet: Allow users to connect their Solana wallet
View NFTs: Display owned NFT players and their attributes
Team Management: Provide UI for team creation and player assignment
Match Scheduling: Interface for finding opponents and scheduling matches
Results Visualization: Display match results and statistics

### Account Requirements
For match simulation, clients must provide all required accounts:

Both team data accounts
All 10 player accounts (5 from each team)

## Development Roadmap

### Phase 1: Core Features (Current)
- NFT integration
- Team management
- Match simulation

### Phase 2: Enhanced Features (Planned)
- Tournaments
- Team upgrades
- Enhanced match algorithms
- Economic features (staking, rewards)

### Phase 3: Ecosystem Expansion (Future)
- Marketplace integration
- DAO governance
- Cross-game compatibility
- Mobile application

## Technical Details

### Bolt ECS Framework

This project uses Bolt, a specialized framework for building Solana programs using the Entity Component System (ECS) architecture:

- Entities are objects in the world (NFTs, teams, matches)
- Components store data about these entities
- Systems implement logic that acts on components

### NFT Integration

The platform uses Metaplex's Programmable NFTs (pNFTs) to:
- Store player attributes
- Track ownership
- Enable trading and transfer of player cards

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Bolt ECS Framework](https://magicblock.gg/)
- [Metaplex](https://www.metaplex.com/)
- [Solana](https://solana.com/)
- [Anchor Framework](https://www.anchor-lang.com/)