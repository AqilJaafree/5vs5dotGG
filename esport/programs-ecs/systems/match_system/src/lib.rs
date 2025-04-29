use bolt_lang::*;
use solana_program::pubkey::Pubkey;
use team_data::TeamData;
use player_stats::PlayerStats;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// You'll need to replace this with an actual program ID when deploying
declare_id!("MaTcHSyst5CQYnj5LsFeyLSRz7WsTJkByqbgVR6M4m");

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
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct PendingMatch {
    pub team1: Pubkey,
    pub team2: Pubkey,
    #[max_len(20)]
    pub match_type: String,
    pub timestamp: i64,
}

#[component]
#[derive(Default)]
pub struct MatchQueue {
    #[max_len(20)]
    pub pending_matches: Vec<PendingMatch>,
}

#[system]
pub mod match_system {

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
        let team1_data = &ctx.accounts.team1_data.as_ref().unwrap();
        let team2_data = &ctx.accounts.team2_data.as_ref().unwrap();
        
        // In a real implementation, you would add this to a match queue component
        // For this example, we're just simulating the match scheduling
        
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
        let team_data = &mut ctx.accounts.team1_data.as_mut().unwrap();
        let player_stats_accounts = ctx.accounts.player_stats.as_ref();
        
        // Simulate the match result
        // In a real implementation, this would use a more complex algorithm
        // and would involve both teams
        
        // For this example, we'll just use a simple algorithm based on player stats
        let mut team_power = 0;
        
        // We're missing the opponent for a proper simulation
        // In a real implementation, you'd compare both teams
        
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
        
        // Update player stats if available
        if let Some(player_stats_vec) = player_stats_accounts {
            for player_stats in player_stats_vec {
                if player_stats.is_some() {
                    let mut player = player_stats.as_ref().unwrap();
                    
                    // Record match result for player
                    // In a real implementation, this would need to be mutable
                    // Since we can't modify it here, just logging
                    msg!("Player {} participated in match", player.nft_mint);
                    
                    // Update form based on match performance (would be mutable in real impl)
                    // player.form = (player.form + random_seed / 20).min(100);
                }
            }
        }
        
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