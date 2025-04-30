use bolt_lang::*;
use solana_program::pubkey::Pubkey;

// You'll need to replace this with an actual program ID when deploying
declare_id!("11111111111111111111111111111111");

// Player in the team roster
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct Player {
    pub nft_mint: Pubkey,
    #[max_len(20)]
    pub position: String,
    pub active: bool,
}

// Strategy definition
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct Strategy {
    #[max_len(20)]
    pub strategy_type: String,
    #[max_len(100)]
    pub description: String,
}

// Match history entry
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct MatchResult {
    #[max_len(50)]
    pub match_id: String,
    pub opponent: Pubkey,
    pub win: bool,
    pub timestamp: i64,
    pub team_score: u8,
    pub opponent_score: u8,
}

#[component]
#[derive(Default)]
pub struct TeamData {
    #[max_len(50)]
    pub name: String,
    pub owner: Pubkey,
    pub created_at: i64,
    #[max_len(5)]
    pub roster: Vec<Player>,
    pub strategy: Strategy,
    #[max_len(20)]
    pub match_history: Vec<MatchResult>,
    pub rating: u16,
}

#[component_methods]
impl TeamData {
    pub fn initialize(
        &mut self,
        name: String,
        owner: Pubkey,
    ) -> Result<()> {
        require!(name.len() > 0, ComponentError::InvalidName);
        
        self.name = name;
        self.owner = owner;
        self.created_at = Clock::get()?.unix_timestamp;
        self.rating = 1000; // Starting ELO rating
        
        Ok(())
    }
    
    pub fn add_player(
        &mut self,
        nft_mint: Pubkey,
        position: String,
    ) -> Result<()> {
        // Validate roster size
        require!(self.roster.len() < 5, ComponentError::RosterFull);
        
        // Check if player is already in the roster
        for player in self.roster.iter() {
            require!(player.nft_mint != nft_mint, ComponentError::PlayerAlreadyInRoster);
        }
        
        // Add player to roster
        self.roster.push(Player {
            nft_mint,
            position,
            active: true,
        });
        
        Ok(())
    }
    
    pub fn remove_player(
        &mut self,
        nft_mint: Pubkey,
    ) -> Result<()> {
        // Find player index
        let player_index = self.roster.iter().position(|p| p.nft_mint == nft_mint);
        require!(player_index.is_some(), ComponentError::PlayerNotFound);
        
        // Remove player
        self.roster.remove(player_index.unwrap());
        
        Ok(())
    }
    
    pub fn set_strategy(
        &mut self,
        strategy_type: String,
        description: String,
    ) -> Result<()> {
        require!(!strategy_type.is_empty(), ComponentError::InvalidStrategy);
        
        self.strategy = Strategy {
            strategy_type,
            description,
        };
        
        Ok(())
    }
    
    pub fn record_match_result(
        &mut self,
        match_id: String,
        opponent: Pubkey,
        win: bool,
        team_score: u8,
        opponent_score: u8,
    ) -> Result<()> {
        // Add to match history
        self.match_history.push(MatchResult {
            match_id,
            opponent,
            win,
            timestamp: Clock::get()?.unix_timestamp,
            team_score,
            opponent_score,
        });
        
        // Update rating based on result
        if win {
            self.rating = self.rating.saturating_add(25);
        } else {
            self.rating = self.rating.saturating_sub(20);
        }
        
        Ok(())
    }
}

#[error_code]
pub enum ComponentError {
    #[msg("Team name must not be empty")]
    InvalidName,
    
    #[msg("Roster already has maximum number of players (5)")]
    RosterFull,
    
    #[msg("Player already in roster")]
    PlayerAlreadyInRoster,
    
    #[msg("Player not found in roster")]
    PlayerNotFound,
    
    #[msg("Strategy type must not be empty")]
    InvalidStrategy,
}