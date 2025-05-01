use bolt_lang::*;
use anchor_lang::AnchorSerialize;
use solana_program::pubkey::Pubkey;
use serde::{Deserialize, Serialize};

// You'll need to replace this with an actual program ID when deploying
declare_id!("11111111111111111111111111111111");

// Serializable arguments for match system
#[derive(Serialize, Deserialize)]
pub struct MatchSystemArgs {
    pub action: String,
    pub match_type: Option<String>,
    pub match_id: Option<String>,
}

// Error codes
#[error_code]
pub enum SystemError {
    #[msg("Invalid arguments format")]
    InvalidArgs,
    
    #[msg("Unknown action")]
    UnknownAction,
    
    #[msg("Team doesn't have enough players")]
    InsufficientRoster,
    
    #[msg("Team hasn't selected a strategy")]
    NoStrategy,
    
    #[msg("Team1 data not found")]
    Team1DataNotFound,
    
    #[msg("Team2 data not found")]
    Team2DataNotFound,
    
    #[msg("Player stats not found")]
    PlayerStatsNotFound,
    
    #[msg("Match type not provided")]
    MatchTypeNotProvided,
    
    #[msg("Match ID not provided")]
    MatchIdNotProvided,
}

/*
 * System implementation
 */
#[system]
pub mod match_system {
    use bolt_lang::*;
    use anchor_lang::prelude::*;
    use solana_program::pubkey::Pubkey;
    use serde_json;
    
    use crate::{SystemError, MatchSystemArgs};
    
    pub fn execute(ctx: Context<Components>, args_bytes: Vec<u8>) -> Result<Vec<Vec<u8>>> {
        // Parse the JSON arguments
        let args_str = std::str::from_utf8(&args_bytes).map_err(|_| SystemError::InvalidArgs)?;
        let args: MatchSystemArgs = serde_json::from_str(args_str)
            .map_err(|_| SystemError::InvalidArgs)?;
        
        // Process instructions based on action
        match args.action.as_str() {
            "scheduleMatch" => {
                let match_type = args.match_type.ok_or(SystemError::MatchTypeNotProvided)?;
                schedule_match(&ctx, match_type)?;
            },
            "simulateMatch" => {
                let match_id = args.match_id.ok_or(SystemError::MatchIdNotProvided)?;
                simulate_match(&ctx, match_id)?;
            },
            _ => return Err(SystemError::UnknownAction.into())
        }
        
        // Return serialized component data
        ctx.accounts.try_to_vec()
    }

    // Schedule a match between two teams
    fn schedule_match(ctx: &Context<Components>, match_type: String) -> Result<()> {
        // Get team1 and team2 data 
        let team1_data = &ctx.accounts.team1_data;
        let team2_data = &ctx.accounts.team2_data;
        
        // Validate teams have enough players
        require!(team1_data.roster.len() > 0, SystemError::InsufficientRoster);
        require!(team2_data.roster.len() > 0, SystemError::InsufficientRoster);
        
        // Validate team has selected a strategy
        require!(!team1_data.strategy.strategy_type.is_empty(), SystemError::NoStrategy);
        
        // Log match scheduling
        msg!("Match scheduled: {} vs {} ({})", team1_data.name, team2_data.name, match_type);
        
        Ok(())
    }
    
    // Simulate a match and record results
    fn simulate_match(ctx: &Context<Components>, match_id: String) -> Result<()> {
        // Get team data - since we're mutating this, we need to access it differently
        let team_data = &mut ctx.accounts.team1_data;
        
        // Process player stats if available
        if let Some(player_stats_vec) = ctx.accounts.player_stats.as_ref() {
            for player_stat in player_stats_vec {
                // Clock used for randomization  
                let clock = Clock::get()?;
                let random_seed = (clock.unix_timestamp % 100) as u8;
                let win = random_seed > 50;
                
                // Log what would happen in a real implementation
                msg!("Player stat would be updated based on match result");
            }
        }
        
        // Generate a match result based on randomization for demonstration
        let clock = Clock::get()?;
        let random_seed = (clock.unix_timestamp % 100) as u8;
        let win = random_seed > 50;
        
        // Record match result for team
        let opponent = Pubkey::default(); // In a real impl, this would be the opponent's entity
        let team_score = if win { 3 } else { 1 };
        let opponent_score = if win { 1 } else { 3 };
        
        team_data.record_match_result(
            match_id,
            opponent,
            win,
            team_score,
            opponent_score,
        )?;
        
        // Log match simulation result
        msg!("Match simulated: {} {}", team_data.name, if win { "won" } else { "lost" });
        
        Ok(())
    }

    // Define the Components struct for system input
    #[system_input]
    pub struct Components {
        pub team1_data: TeamData,
        pub team2_data: TeamData,
        pub player_stats: Option<Vec<PlayerStats>>,
        #[account(signer)]
        pub authority: AccountInfo<'info>,
    }
}