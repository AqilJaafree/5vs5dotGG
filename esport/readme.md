# 5VS5dotGG

## Overview

5VS5dotGG is a decentralized esports manager platform built on Solana blockchain using the Bolt Entity Component System (ECS) framework. The platform enables NFT-based team management and match simulation for competitive esports teams.

## Key Features

- **NFT Player Cards:** Creators mint player NFTs with esports attributes
- **Team Formation:** Players create teams and add NFT players
- **Match Simulation:** Automatic match simulation based on team attributes and player stats

## Architecture

The project leverages Bolt ECS architecture with:

- **Components:** State containers for different aspects of the system
- **Systems:** Logic handlers that operate on components
- **Entities:** Objects that components attach to

### Components

1. **PlayerStats**
   - NFT mint address
   - Player role/position
   - Attributes (mechanical, game knowledge, etc.)
   - Match statistics

2. **TeamData**
   - Team name and owner
   - Player roster (NFT players)
   - Team strategy
   - Match history

3. **Position**
   - Basic position component for spatial coordinates

### Systems

1. **TeamSystem**
   - Team creation
   - Roster management
   - Strategy selection
   - Team disbanding

2. **MatchSystem**
   - Match scheduling
   - Match simulation
   - Result determination

3. **Movement**
   - Basic movement system (template for future extensions)

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

4. Generate program IDs:
   ```bash
   solana-keygen new -o target/deploy/player_stats-keypair.json
   solana-keygen new -o target/deploy/team_data-keypair.json
   # Generate for all components and systems
   ```

5. Update program IDs in files and `Anchor.toml`

6. Deploy:
   ```bash
   anchor deploy
   ```

### Running Tests

```bash
anchor test
```

## User Flows

### Creator Flow

1. Creator mints NFT players with attributes
2. Players use NFTs in matches

### Player Flow

1. Player acquires NFT players
2. Player creates a team
3. Player adds NFTs to team roster
4. Player selects team strategy
5. Player schedules matches
6. Match is simulated on-chain
7. Player views results and stats
8. Player can disband team when desired

## Smart Contract Structure

```
esport/
├── programs/
│   └── esport/                       # Main program
│
├── programs-ecs/
│   ├── components/                    # State storage
│   │   ├── position/                  # Basic position component
│   │   ├── player_stats/              # Player NFT attributes
│   │   └── team_data/                 # Team information
│   │
│   └── systems/                       # Game logic
│       ├── movement/                  # Basic movement system
│       ├── team_system/               # Team management
│       └── match_system/              # Match scheduling & simulation
│
├── tests/                             # Tests
│   └── esport.ts                      # End-to-end test
```

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