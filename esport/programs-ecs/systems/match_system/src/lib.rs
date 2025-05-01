use bolt_lang::*;
use anchor_lang::AnchorSerialize;
use solana_program::pubkey::Pubkey;

// You'll need to replace this with an actual program ID when deploying
declare_id!("11111111111111111111111111111111");

// Use the #[arguments] attribute instead of manual Serialize/Deserialize
#[arguments]
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
    use anchor_lang::prelude::msg;
    use solana_program::pubkey::Pubkey;
    
    // Import components explicitly
    use team_data::TeamData;
    use player_stats::PlayerStats;
    
    use crate::{SystemError, MatchSystemArgs};
    
    pub fn execute(ctx: Context<Components>, args: MatchSystemArgs) -> Result<Components> {
        // Process instructions based on action
        match args.action.as_str() {
            "scheduleMatch" => {
                let match_type = args.match_type.ok_or(SystemError::MatchTypeNotProvided)?;
                
                // Get team data directly
                let team1_data = &ctx.accounts.team1_data;
                let team2_data = &ctx.accounts.team2_data;
                
                // Validate teams have enough players
                require!(team1_data.roster.len() > 0, SystemError::InsufficientRoster);
                require!(team2_data.roster.len() > 0, SystemError::InsufficientRoster);
                
                // Validate team has selected a strategy
                require!(!team1_data.strategy.strategy_type.is_empty(), SystemError::NoStrategy);
                
                // Log match scheduling
                msg!("Match scheduled: {} vs {} ({})", team1_data.name, team2_data.name, match_type);
            },
            "simulateMatch" => {
                let match_id = args.match_id.ok_or(SystemError::MatchIdNotProvided)?;
                
                // Get team data for modification
                let team_data = &mut ctx.accounts.team1_data;
                
                // Access player stats directly - no need for Option handling now
                let team1_players = [
                    &ctx.accounts.team1_player1, 
                    &ctx.accounts.team1_player2, 
                    &ctx.accounts.team1_player3, 
                    &ctx.accounts.team1_player4, 
                    &ctx.accounts.team1_player5
                ];
                
                let team2_players = [
                    &ctx.accounts.team2_player1, 
                    &ctx.accounts.team2_player2, 
                    &ctx.accounts.team2_player3, 
                    &ctx.accounts.team2_player4, 
                    &ctx.accounts.team2_player5
                ];
                
                // Simulation logic
                let mut team1_strength = 0;
                let mut team2_strength = 0;
                
                // Calculate team1 strength
                for player in team1_players.iter() {
                    // Use player attributes to calculate match contribution
                    let player_contribution = 
                        player.mechanical as u32 +
                        player.game_knowledge as u32 +
                        player.team_communication as u32 + 
                        player.form as u32;
                    
                    team1_strength += player_contribution;
                    
                    // Log for debug purposes
                    msg!("Team 1 player {} contributing strength: {}", player.role, player_contribution);
                }
                
                // Calculate team2 strength
                for player in team2_players.iter() {
                    // Use player attributes to calculate match contribution
                    let player_contribution = 
                        player.mechanical as u32 +
                        player.game_knowledge as u32 +
                        player.team_communication as u32 + 
                        player.form as u32;
                    
                    team2_strength += player_contribution;
                    
                    // Log for debug purposes
                    msg!("Team 2 player {} contributing strength: {}", player.role, player_contribution);
                }
                
                // Add randomness factor (still influenced by team strength)
                let clock = Clock::get()?;
                let random_factor = (clock.unix_timestamp % 100) as u32;
                
                // Determine match winner with weighted randomness
                let team1_final = team1_strength + (random_factor % 50);
                let team2_final = team2_strength + ((100 - random_factor) % 50);
                
                let win = team1_final > team2_final;
                
                // Record match result
                team_data.record_match_result(
                    match_id,
                    ctx.accounts.team2_data.key(),
                    win,
                    if win { 3 } else { 1 },
                    if win { 1 } else { 3 },
                )?;
                
                // Update player stats based on match result
                // Note: In a real implementation, you would need to make these mutable
                // and update them. For now, we're just logging what would happen.
                for player in team1_players.iter() {
                    msg!("Player {} would record match result: {}", player.role, win);
                    // In a real implementation with mutable access:
                    // player.record_match_result(win)?;
                }
                
                msg!("Match simulated: {} {} with score {}-{}", 
                    team_data.name, 
                    if win { "won" } else { "lost" },
                    if win { 3 } else { 1 },
                    if win { 1 } else { 3 }
                );
            },
            _ => return Err(SystemError::UnknownAction.into())
        }
        
        Ok(ctx.accounts)
    }

    // Define Components struct with non-optional PlayerStats fields
    #[system_input]
    pub struct Components {
        pub team1_data: TeamData,
        pub team2_data: TeamData,
        // Team 1 players - all required now
        pub team1_player1: PlayerStats,
        pub team1_player2: PlayerStats,
        pub team1_player3: PlayerStats,
        pub team1_player4: PlayerStats,
        pub team1_player5: PlayerStats,
        // Team 2 players - all required now
        pub team2_player1: PlayerStats,
        pub team2_player2: PlayerStats,
        pub team2_player3: PlayerStats,
        pub team2_player4: PlayerStats,
        pub team2_player5: PlayerStats,
    }
}