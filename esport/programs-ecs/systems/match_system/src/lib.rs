use bolt_lang::*;
use solana_program::pubkey::Pubkey;
use team_data::TeamData;
use player_stats::PlayerStats;
use serde::{Deserialize, Serialize};

// You'll need to replace this with an actual program ID when deploying
declare_id!("11111111111111111111111111111111");

// Serializable arguments for match system
#[derive(Serialize, Deserialize)]
struct ScheduleMatchArgs {
    action: String, // Should be "scheduleMatch"
    match_type: String, // "friendly", "ranked", etc.
}

#[derive(Serialize, Deserialize)]
struct SimulateMatchArgs {
    action: String, // Should be "simulateMatch"
    match_id: String,
}

// Pending match struct for storage
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, InitSpace)]
pub struct PendingMatch {
    pub team1: Pubkey,
    pub team2: Pubkey,
    #[max_len(20)]
    pub match_type: String,
    pub timestamp: i64,
}

#[component]
// Don't add InitSpace here - the component macro will add it automatically
#[derive(Default)]
pub struct MatchQueue {
    #[max_len(20)]
    pub pending_matches: Vec<PendingMatch>,
}

#[system]
pub mod match_system {
    use super::*;
    
    pub fn execute(ctx: Context<Components>, args_bytes: Vec<u8>) -> Result<Components> {
        // Parse the JSON arguments
        let args_str = std::str::from_utf8(&args_bytes).map_err(|_| SystemError::InvalidArgs)?;
        
        if args_str.contains("\"action\":\"scheduleMatch\"") {
            let args: ScheduleMatchArgs = serde_json::from_str(args_str).map_err(|_| SystemError::InvalidArgs)?;
            return schedule_match(ctx, args);
        } else if args_str.contains("\"action\":\"simulateMatch\"") {
            let args: SimulateMatchArgs = serde_json::from_str(args_str).map_err(|_| SystemError::InvalidArgs)?;
            return simulate_match(ctx, args);
        } else {
            return Err(SystemError::UnknownAction.into());
        }
    }

    fn schedule_match(ctx: Context<Components>, args: ScheduleMatchArgs) -> Result<Components> {
        let team1_data = match &ctx.accounts.team1_data {
            Some(data) => data,
            None => return Err(SystemError::InvalidArgs.into()),
        };
        
        let team2_data = match &ctx.accounts.team2_data {
            Some(data) => data,
            None => return Err(SystemError::InvalidArgs.into()),
        };
        
        // Validate teams have enough players
        require!(team1_data.roster.len() > 0, SystemError::InsufficientRoster);
        require!(team2_data.roster.len() > 0, SystemError::InsufficientRoster);
        
        // Validate team has selected a strategy
        require!(!team1_data.strategy.strategy_type.is_empty(), SystemError::NoStrategy);
        
        // Log match scheduling (in production, would be added to a queue)
        msg!("Match scheduled: {} vs {}", team1_data.name, team2_data.name);
        
        Ok(ctx.accounts)
    }
    
    fn simulate_match(ctx: Context<Components>, args: SimulateMatchArgs) -> Result<Components> {
        let team_data = match &mut ctx.accounts.team1_data {
            Some(data) => data,
            None => return Err(SystemError::InvalidArgs.into()),
        };
        
        // For a real implementation, this would use a more complex algorithm
        // and would involve both teams
        
        // For now, generate a random result
        let clock = Clock::get()?;
        let random_seed = (clock.unix_timestamp % 100) as u8;
        let win = random_seed > 50;
        
        // Record match result for team
        let opponent = Pubkey::default(); // In a real impl, this would be the opponent's entity
        let team_score = if win { 3 } else { 1 };
        let opponent_score = if win { 1 } else { 3 };
        
        team_data.record_match_result(
            args.match_id,
            opponent,
            win,
            team_score,
            opponent_score,
        )?;
        
        // Log match simulation result
        msg!("Match simulated: {} {}", team_data.name, if win { "won" } else { "lost" });
        
        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub team1_data: Option<TeamData>,
        pub team2_data: Option<TeamData>,
        pub player_stats: Option<Vec<Option<PlayerStats>>>,
    }
}

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
}