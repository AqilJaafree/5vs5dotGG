# 5VS5dotGG

## Overview

5VS5dotGG is a decentralized esports manager platform built on Solana blockchain using the Bolt Entity Component System (ECS) framework. The platform enables NFT-based team management, match simulation, and revenue sharing between NFT creators and platform developers.


## Key Features

- **NFT Player Cards:** Creators mint player NFTs with esports attributes
- **Team Formation:** Players stake SOL to create teams and add NFT players
- **Match Simulation:** Automatic match simulation based on team attributes
- **Revenue Distribution:** 60% of match fees go to NFT creators, 40% to platform

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

3. **TeamStake**
   - Staked SOL amount
   - Staking timestamps
   - Locking mechanics

4. **CreatorRevenue**
   - Creator earnings
   - Revenue history
   - Withdrawal management

### Systems

1. **TeamSystem**
   - Team creation with SOL staking
   - Roster management
   - Strategy selection
   - Unstaking

2. **MatchSystem**
   - Match scheduling
   - Match simulation
   - Result determination

3. **RevenueSystem**
   - Match fee collection
   - Fee distribution to creators
   - Creator withdrawals

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
3. Creators earn 60% of match fees

### Player Flow

1. Player acquires NFT players
2. Player stakes SOL to create team
3. Player adds NFTs to team roster
4. Player selects team strategy
5. Player schedules matches
6. Match is simulated on-chain
7. Player views results and stats
8. Player can unstake SOL to dissolve team

### Economic Flow

1. Match fees (0.1 SOL) are collected
2. 60% distributed to NFT creators
3. 40% goes to platform developers

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
│   │   ├── team_data/                 # Team information
│   │   ├── team_stake/                # Team staking details
│   │   └── creator_revenue/           # Creator revenue tracking
│   │
│   └── systems/                       # Game logic
│       ├── movement/                  # Basic movement system
│       ├── team_system/               # Team management
│       ├── match_system/              # Match scheduling & simulation
│       └── revenue_system/            # Revenue distribution
│
├── tests/                             # Tests
│   └── esport.ts                      # End-to-end test
```

## Development Roadmap

### Phase 1: Core Features (Completed)
- NFT integration
- Team management
- Match simulation
- Revenue distribution

### Phase 2: Enhanced Features (Planned)
- Tournaments
- Staking rewards
- Team upgrades
- Enhanced match algorithms

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

### SOL Transfers

SOL transfers are implemented for:
- Team staking (minimum 1 SOL)
- Match fees (0.1 SOL per match)
- Revenue distribution (60% to creators, 40% to platform)

### NFT Integration

The platform uses Metaplex's Programmable NFTs (pNFTs) to:
- Store player attributes
- Track ownership
- Manage creator royalties

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