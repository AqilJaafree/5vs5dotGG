use bolt_lang::*;
use solana_program::pubkey::Pubkey;
use team_data::TeamData;
use player_stats::PlayerStats;
use serde::{Deserialize, Serialize};

// You'll need to replace this with an actual program ID when deploying
declare_id!("11111111111111111111111111111111");

// Define serializable arguments for the system
#[derive(Serialize, Deserialize)]
struct CreateTeamArgs {
    action: String, // Should be "createTeam"
    team_name: String,
}

#[derive(Serialize, Deserialize)]
struct AddPlayerArgs {
    action: String, // Should be "addPlayerToTeam"
    player_nft_mint: Pubkey,
    position: String,
}

#[derive(Serialize, Deserialize)]
struct RemovePlayerArgs {
    action: String, // Should be "removePlayerFromTeam"
    player_nft_mint: Pubkey,
}

#[derive(Serialize, Deserialize)]
struct SetStrategyArgs {
    action: String, // Should be "setStrategy"
    strategy: Strategy,
}

#[derive(Serialize, Deserialize)]
struct Strategy {
    #[serde(rename = "type")]
    strategy_type: String,
    description: String,
}

#[derive(Serialize, Deserialize)]
struct DisbandTeamArgs {
    action: String, // Should be "disbandTeam"
}

#[system]
pub mod team_system {

    pub fn execute(ctx: Context<Components>, args_bytes: Vec<u8>) -> Result<Components> {
        // Parse the JSON arguments
        let args_str = std::str::from_utf8(&args_bytes).map_err(|_| SystemError::InvalidArgs)?;
        
        // Check the action type and call the appropriate handler
        if args_str.contains("\"action\":\"createTeam\"") {
            let args: CreateTeamArgs = serde_json::from_str(args_str).map_err(|_| SystemError::InvalidArgs)?;
            return create_team(ctx, args);
        } else if args_str.contains("\"action\":\"addPlayerToTeam\"") {
            let args: AddPlayerArgs = serde_json::from_str(args_str).map_err(|_| SystemError::InvalidArgs)?;
            return add_player_to_team(ctx, args);
        } else if args_str.contains("\"action\":\"removePlayerFromTeam\"") {
            let args: RemovePlayerArgs = serde_json::from_str(args_str).map_err(|_| SystemError::InvalidArgs)?;
            return remove_player_from_team(ctx, args);
        } else if args_str.contains("\"action\":\"setStrategy\"") {
            let args: SetStrategyArgs = serde_json::from_str(args_str).map_err(|_| SystemError::InvalidArgs)?;
            return set_strategy(ctx, args);
        } else if args_str.contains("\"action\":\"disbandTeam\"") {
            let args: DisbandTeamArgs = serde_json::from_str(args_str).map_err(|_| SystemError::InvalidArgs)?;
            return disband_team(ctx, args);
        } else {
            return Err(SystemError::UnknownAction.into());
        }
    }

    fn create_team(ctx: Context<Components>, args: CreateTeamArgs) -> Result<Components> {
        let team_data = &mut ctx.accounts.team_data;
        
        // Initialize team data
        team_data.initialize(args.team_name, ctx.system_context.authority)?;
        
        msg!("Team created: {}", args.team_name);
        
        Ok(ctx.accounts)
    }
    
    fn add_player_to_team(ctx: Context<Components>, args: AddPlayerArgs) -> Result<Components> {
        let team_data = &mut ctx.accounts.team_data;
        let player_stats = &ctx.accounts.player_stats;
        
        // Verify ownership of NFT - this is just a placeholder
        // In a real implementation, you would check if the authority owns the NFT
        require!(
            player_stats.nft_mint == args.player_nft_mint,
            SystemError::InvalidNftOwnership
        );
        
        // Add player to team roster
        team_data.add_player(args.player_nft_mint, args.position)?;
        
        msg!("Player added to team: {}", args.position);
        
        Ok(ctx.accounts)
    }
    
    fn remove_player_from_team(ctx: Context<Components>, args: RemovePlayerArgs) -> Result<Components> {
        let team_data = &mut ctx.accounts.team_data;
        
        // Verify team ownership
        require!(
            team_data.owner == ctx.system_context.authority,
            SystemError::NotTeamOwner
        );
        
        // Remove player from team roster
        team_data.remove_player(args.player_nft_mint)?;
        
        msg!("Player removed from team");
        
        Ok(ctx.accounts)
    }
    
    fn set_strategy(ctx: Context<Components>, args: SetStrategyArgs) -> Result<Components> {
        let team_data = &mut ctx.accounts.team_data;
        
        // Verify team ownership
        require!(
            team_data.owner == ctx.system_context.authority,
            SystemError::NotTeamOwner
        );
        
        // Set team strategy
        team_data.set_strategy(args.strategy.strategy_type, args.strategy.description)?;
        
        msg!("Team strategy set: {}", args.strategy.strategy_type);
        
        Ok(ctx.accounts)
    }
    
    fn disband_team(ctx: Context<Components>, _args: DisbandTeamArgs) -> Result<Components> {
        let team_data = &mut ctx.accounts.team_data;
        
        // Verify team ownership
        require!(
            team_data.owner == ctx.system_context.authority,
            SystemError::NotTeamOwner
        );
        
        // Disband team
        team_data.disband()?;
        
        msg!("Team disbanded");
        
        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub team_data: Option<TeamData>,
        pub player_stats: Option<PlayerStats>,
    }
}

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
}