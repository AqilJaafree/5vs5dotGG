// match_system.rs
use bolt_lang::*;
use solana_program::pubkey::Pubkey;
use team_data::TeamData;
use player_stats::PlayerStats;
use serde::{Deserialize, Serialize};
// Import the match queue from separate file
use match_queue::{MatchQueue, PendingMatch};

// You'll need to replace this with an actual program ID when deploying
declare_id!("11111111111111111111111111111111");

// Serializable arguments for match system
#[derive(Serialize, Deserialize)]
pub struct MatchSystemArgs {
    pub action: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub match_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
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
    use super::*;

    pub fn execute(ctx: Context<Components>, args_bytes: Vec<u8>) -> Result<Components> {
        // Parse the JSON arguments
        let args_str = std::str::from_utf8(&args_bytes).map_err(|_| SystemError::InvalidArgs)?;
        let args: MatchSystemArgs = serde_json::from_str(args_str)
            .map_err(|_| SystemError::InvalidArgs)?;
        
        // Dispatch to appropriate handler based on action
        match args.action.as_str() {
            "scheduleMatch" => {
                let match_type = args.match_type.ok_or(SystemError::MatchTypeNotProvided)?;
                schedule_match(ctx, match_type)
            },
            "simulateMatch" => {
                let match_id = args.match_id.ok_or(SystemError::MatchIdNotProvided)?;
                simulate_match(ctx, match_id)
            },
            _ => Err(SystemError::UnknownAction.into())
        }
    }

    // Schedule a match between two teams
    fn schedule_match(ctx: Context<Components>, match_type: String) -> Result<Components> {
        // Get team1_data from Option
        let team1_data = if let Some(data) = &ctx.accounts.team1_data {
            data
        } else {
            return Err(SystemError::Team1DataNotFound.into());
        };
        
        // Get team2_data from Option
        let team2_data = if let Some(data) = &ctx.accounts.team2_data {
            data
        } else {
            return Err(SystemError::Team2DataNotFound.into());
        };
        
        // Validate teams have enough players
        require!(team1_data.roster.len() > 0, SystemError::InsufficientRoster);
        require!(team2_data.roster.len() > 0, SystemError::InsufficientRoster);
        
        // Validate team has selected a strategy
        require!(!team1_data.strategy.strategy_type.is_empty(), SystemError::NoStrategy);
        
        // Log match scheduling (in production, would be added to a queue)
        msg!("Match scheduled: {} vs {} ({})", team1_data.name, team2_data.name, match_type);
        
        Ok(ctx.accounts)
    }
    
    // Simulate a match and record results
    fn simulate_match(ctx: Context<Components>, match_id: String) -> Result<Components> {
        // Get team_data from Option and make it mutable
        let team_data = if let Some(data) = &mut ctx.accounts.team1_data {
            data
        } else {
            return Err(SystemError::Team1DataNotFound.into());
        };
        
        // Update player stats if provided
        if let Some(player_stats_vec) = &mut ctx.accounts.player_stats {
            for player_stats_option in player_stats_vec.iter_mut() {
                if let Some(player_stats) = player_stats_option {
                    // Clock used for randomization
                    let clock = Clock::get()?;
                    let random_seed = (clock.unix_timestamp % 100) as u8;
                    let win = random_seed > 50;
                    
                    // Update player stats based on match result
                    player_stats.record_match_result(win)?;
                    
                    // Potentially update form based on performance
                    let new_form = if win {
                        // Slight form improvement on win
                        (player_stats.form as u16).saturating_add(5).min(100) as u8
                    } else {
                        // Slight form decrease on loss
                        (player_stats.form as u16).saturating_sub(3).max(0) as u8
                    };
                    
                    player_stats.update_form(new_form)?;
                }
            }
        }
        
        // Generate a match result based on team stats, player attributes, etc.
        // For now, use simple randomization
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
        
        Ok(ctx.accounts)
    }

    // Input structure definition
    #[system_input]
    pub struct Components {
        pub team1_data: Option<TeamData>,
        pub team2_data: Option<TeamData>,
        pub player_stats: Option<Vec<Option<PlayerStats>>>,
        pub match_queue: Option<MatchQueue>,
        #[account(signer)]
        pub authority: Signer<'info>,
    }
}