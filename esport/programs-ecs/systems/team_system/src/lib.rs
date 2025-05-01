use bolt_lang::*;
use solana_program::pubkey::Pubkey;
use serde::{Deserialize, Serialize};

// Import components directly, not using Option<T> in the system
use team_data::TeamData;
use player_stats::PlayerStats;

// You'll need to replace this with an actual program ID when deploying
declare_id!("11111111111111111111111111111111");

// Serializable arguments for team system
#[derive(Serialize, Deserialize)]
pub struct TeamSystemArgs {
    pub action: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub team_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub player_nft_mint: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub strategy_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
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
    
    #[msg("Team data not found")]
    TeamDataNotFound,
    
    #[msg("Player stats not found")]
    PlayerStatsNotFound,
    
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

/*
 * System implementation
 */
#[system]
pub mod team_system {
    use super::*;
    
    pub fn execute(ctx: Context<Components>, args_bytes: Vec<u8>) -> Result<Components> {
        // Parse the JSON arguments
        let args_str = std::str::from_utf8(&args_bytes).map_err(|_| SystemError::InvalidArgs)?;
        let args: TeamSystemArgs = serde_json::from_str(args_str)
            .map_err(|_| SystemError::InvalidArgs)?;
        
        // Dispatch to appropriate handler based on action
        match args.action.as_str() {
            "createTeam" => {
                let team_name = args.team_name.ok_or(SystemError::TeamNameNotProvided)?;
                create_team(ctx, team_name)
            },
            "addPlayerToTeam" => {
                let player_nft_mint = args.player_nft_mint.ok_or(SystemError::PlayerNftMintNotProvided)?;
                let position = args.position.ok_or(SystemError::PositionNotProvided)?;
                add_player_to_team(ctx, player_nft_mint, position)
            },
            "removePlayerFromTeam" => {
                let player_nft_mint = args.player_nft_mint.ok_or(SystemError::PlayerNftMintNotProvided)?;
                remove_player_from_team(ctx, player_nft_mint)
            },
            "setStrategy" => {
                let strategy_type = args.strategy_type.ok_or(SystemError::StrategyTypeNotProvided)?;
                let strategy_description = args.strategy_description.ok_or(SystemError::StrategyDescriptionNotProvided)?;
                set_strategy(ctx, strategy_type, strategy_description)
            },
            "disbandTeam" => {
                disband_team(ctx)
            },
            _ => Err(SystemError::UnknownAction.into())
        }
    }
    
    // Create a new team
    fn create_team(ctx: Context<Components>, team_name: String) -> Result<Components> {
        let team_data_account = &ctx.accounts.team_data;
        
        // Get the TeamData from our component
        let mut team_data = team_data_account.load_mut()?;
        
        let authority = ctx.accounts.authority.key;
        
        // Initialize team data
        team_data.initialize(team_name.clone(), authority)?;
        
        msg!("Team created: {}", team_name);
        
        Ok(ctx.accounts)
    }
    
    // Add a player to a team
    fn add_player_to_team(ctx: Context<Components>, player_nft_mint_str: String, position: String) -> Result<Components> {
        let team_data_account = &ctx.accounts.team_data;
        let player_stats_account = &ctx.accounts.player_stats;
        
        // Get the TeamData from our component
        let mut team_data = team_data_account.load_mut()?;
        
        // Get the PlayerStats from our component
        let player_stats = player_stats_account.load()?;
        
        // Convert string to Pubkey
        let player_nft_mint = match Pubkey::try_from(player_nft_mint_str.as_str()) {
            Ok(pubkey) => pubkey,
            Err(_) => return Err(SystemError::InvalidArgs.into()),
        };
        
        // Verify ownership of NFT
        require!(
            player_stats.nft_mint == player_nft_mint,
            SystemError::InvalidNftOwnership
        );
        
        // Add player to team roster
        team_data.add_player(player_nft_mint, position.clone())?;
        
        msg!("Player added to team: {}", position);
        
        Ok(ctx.accounts)
    }
    
    // Remove a player from a team
    fn remove_player_from_team(ctx: Context<Components>, player_nft_mint_str: String) -> Result<Components> {
        let team_data_account = &ctx.accounts.team_data;
        
        // Get the TeamData from our component
        let mut team_data = team_data_account.load_mut()?;
        
        let authority = ctx.accounts.authority.key;
        
        // Verify team ownership
        require!(
            team_data.owner == authority,
            SystemError::NotTeamOwner
        );
        
        // Convert string to Pubkey
        let player_nft_mint = match Pubkey::try_from(player_nft_mint_str.as_str()) {
            Ok(pubkey) => pubkey,
            Err(_) => return Err(SystemError::InvalidArgs.into()),
        };
        
        // Remove player from team roster
        team_data.remove_player(player_nft_mint)?;
        
        msg!("Player removed from team");
        
        Ok(ctx.accounts)
    }
    
    // Set team strategy
    fn set_strategy(ctx: Context<Components>, strategy_type: String, strategy_description: String) -> Result<Components> {
        let team_data_account = &ctx.accounts.team_data;
        
        // Get the TeamData from our component
        let mut team_data = team_data_account.load_mut()?;
        
        let authority = ctx.accounts.authority.key;
        
        // Verify team ownership
        require!(
            team_data.owner == authority,
            SystemError::NotTeamOwner
        );
        
        // Set team strategy
        team_data.set_strategy(strategy_type.clone(), strategy_description)?;
        
        msg!("Team strategy set: {}", strategy_type);
        
        Ok(ctx.accounts)
    }
    
    // Disband a team
    fn disband_team(ctx: Context<Components>) -> Result<Components> {
        let team_data_account = &ctx.accounts.team_data;
        
        // Get the TeamData from our component
        let mut team_data = team_data_account.load_mut()?;
        
        let authority = ctx.accounts.authority.key;
        
        // Verify team ownership
        require!(
            team_data.owner == authority,
            SystemError::NotTeamOwner
        );
        
        // Disband team
        team_data.disband()?;
        
        msg!("Team disbanded");
        
        Ok(ctx.accounts)
    }

    // Define the Components struct 
    #[system_input]
    pub struct Components {
        #[account()]
        pub team_data: AccountLoader<'info, TeamData>,
        #[account()]
        pub player_stats: AccountLoader<'info, PlayerStats>,
    }
}