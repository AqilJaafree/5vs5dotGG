use bolt_lang::*;
use serde::Deserialize;
use std::str::FromStr;
use solana_program::pubkey::Pubkey;

// Explicitly import the component types
use team_data::TeamData;
use player_stats::PlayerStats;

// You'll need to replace this with an actual program ID when deploying
declare_id!("11111111111111111111111111111111");

// Serializable arguments for team system
#[arguments]
pub struct TeamSystemArgs {
    pub action: String,
    pub team_name: Option<String>,
    pub player_nft_mint: Option<String>,
    pub position: Option<String>,
    pub strategy_type: Option<String>,
    pub strategy_description: Option<String>,
}

// Error codes
#[error_code]
pub enum SystemError {
    #[msg("Invalid arguments format")]
    InvalidArgs,
    
    #[msg("Unknown action")]
    UnknownAction,
    
    #[msg("Not the team owner")]
    NotTeamOwner,
    
    #[msg("Invalid NFT ownership")]
    InvalidNftOwnership,
    
    #[msg("Team name not provided")]
    TeamNameNotProvided,
    
    #[msg("Player NFT mint not provided")]
    PlayerNftMintNotProvided,
    
    #[msg("Position not provided")]
    PositionNotProvided,
    
    #[msg("Strategy type not provided")]
    StrategyTypeNotProvided,
    
    #[msg("Strategy description not provided")]
    StrategyDescriptionNotProvided,
}

#[system]
pub mod team_system {
    // Import everything we need in the system module scope
    use bolt_lang::*;
    use anchor_lang::prelude::msg;
    use solana_program::pubkey::Pubkey;
    use std::str::FromStr;
    
    // Import these components explicitly
    use team_data::TeamData;
    use player_stats::PlayerStats;
    
    use crate::{SystemError, TeamSystemArgs};
    
    pub fn execute(ctx: Context<Components>, args: TeamSystemArgs) -> Result<Components> {
        // Get the authority key
        let authority = ctx.accounts.authority.key();
        
        // Dispatch to appropriate handler based on action
        match args.action.as_str() {
            "createTeam" => {
                let team_name = args.team_name.ok_or(SystemError::TeamNameNotProvided)?;
                
                let team_data = &mut ctx.accounts.team_data;
                team_data.initialize(team_name.clone(), authority)?;
                
                msg!("Team created: {}", team_name);
            },
            "addPlayerToTeam" => {
                let player_nft_mint_str = args.player_nft_mint.ok_or(SystemError::PlayerNftMintNotProvided)?;
                let position = args.position.ok_or(SystemError::PositionNotProvided)?;
                
                // Convert string to Pubkey
                let player_nft_mint = Pubkey::from_str(&player_nft_mint_str)
                    .map_err(|_| SystemError::InvalidArgs)?;
                
                // Verify ownership matches
                let player_stats = &ctx.accounts.player_stats;
                require!(player_stats.nft_mint == player_nft_mint, SystemError::InvalidNftOwnership);
                
                // Add player to team
                let team_data = &mut ctx.accounts.team_data;
                require!(team_data.owner == authority, SystemError::NotTeamOwner);
                team_data.add_player(player_nft_mint, position.clone())?;
                
                msg!("Player added to team: {}", position);
            },
            "removePlayerFromTeam" => {
                let player_nft_mint_str = args.player_nft_mint.ok_or(SystemError::PlayerNftMintNotProvided)?;
                
                // Convert string to Pubkey
                let player_nft_mint = Pubkey::from_str(&player_nft_mint_str)
                    .map_err(|_| SystemError::InvalidArgs)?;
                
                // Remove player from team
                let team_data = &mut ctx.accounts.team_data;
                require!(team_data.owner == authority, SystemError::NotTeamOwner);
                team_data.remove_player(player_nft_mint)?;
                
                msg!("Player removed from team");
            },
            "setStrategy" => {
                let strategy_type = args.strategy_type.ok_or(SystemError::StrategyTypeNotProvided)?;
                let strategy_description = args.strategy_description.ok_or(SystemError::StrategyDescriptionNotProvided)?;
                
                // Set team strategy
                let team_data = &mut ctx.accounts.team_data;
                require!(team_data.owner == authority, SystemError::NotTeamOwner);
                team_data.set_strategy(strategy_type.clone(), strategy_description)?;
                
                msg!("Team strategy set: {}", strategy_type);
            },
            "disbandTeam" => {
                // Disband team
                let team_data = &mut ctx.accounts.team_data;
                require!(team_data.owner == authority, SystemError::NotTeamOwner);
                team_data.disband()?;
                
                msg!("Team disbanded");
            },
            _ => return Err(SystemError::UnknownAction.into())
        }
        
        Ok(ctx.accounts)
    }

    // Define the Components struct for system input
    #[system_input]
    pub struct Components {
        pub team_data: TeamData,
        pub player_stats: PlayerStats,
    }
}