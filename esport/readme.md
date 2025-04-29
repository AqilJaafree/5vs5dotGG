# 5vs5dotGG contract

```
esport/
├── programs/                           # Main program/contract folder
│   └── esport/                         # Main program (already exists)
│       ├── src/lib.rs                  # Entry point (initialize world)
│       ├── Cargo.toml
│       └── Xargo.toml
│
├── programs-ecs/                       # ECS components
│   ├── components/                     # State storage
│   │   ├── position/                   # Basic component (already exists)
│   │   ├── player_stats/               # Player NFT attributes
│   │   ├── team_data/                  # Team information
│   │   ├── team_stake/                 # Team staking details
│   │   └── creator_revenue/            # Creator revenue tracking
│   │
│   └── systems/                        # Game logic
│       ├── movement/                   # Basic system (already exists)
│       ├── team_system/                # Team management
│       ├── match_system/               # Match scheduling & simulation
│       └── revenue_system/             # Revenue distribution
│
├── tests/                              # Tests
│   └── esport.ts                       # End-to-end test
│
├── Anchor.toml                         # Project configuration
├── package.json                        # NPM dependencies
└── readme.md                           # Project documentation

```

## Component Design (State Storage)
Each component will store specific state information:

### PlayerStats Component

NFT mint address
Role/position
Attributes (mechanical, game knowledge, etc.)
Form/condition
Potential


### TeamData Component

Team name
Owner public key
Roster (array of player NFTs and positions)
Strategy
Match history
Ranking/rating


### TeamStake Component

Team entity reference
Staked amount
Staking timestamp
Last reward timestamp


### CreatorRevenue Component

Creator public key
NFT mint address
Total earned
Withdrawal history



## System Design (Logic)
Systems will implement the game logic:

### TeamSystem

createTeamWithStake: Create team with SOL stake
addPlayerToTeam: Add owned NFT to team roster
removePlayerFromTeam: Remove NFT from roster
setStrategy: Select team strategy
unstakeFromTeam: Withdraw stake and dissolve team


### MatchSystem

scheduleMatch: Schedule match with opponent
simulateMatch: Run match simulation
calculateResults: Determine winner and statistics
updateRankings: Update team rankings


### RevenueSystem

distributeMatchRevenue: Split match fees
withdrawCreatorRevenue: Allow creators to withdraw earnings
calculateFeeSplits: Calculate revenue distribution