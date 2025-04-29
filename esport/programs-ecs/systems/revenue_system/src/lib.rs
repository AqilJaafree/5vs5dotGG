use bolt_lang::*;
use solana_program::pubkey::Pubkey;
use creator_revenue::CreatorRevenue;
use serde::{Deserialize, Serialize};

// You'll need to replace this with an actual program ID when deploying
declare_id!("R3v3Nu3Sys5CQYnj5LsFeyLSRz7WsTJkByqbgVR6M4r");

// Serializable arguments for revenue system
#[derive(Serialize, Deserialize)]
struct DistributeRevenueArgs {
    action: String, // Should be "distributeMatchRevenue"
    match_id: String,
    total_fees: u64,
}

#[derive(Serialize, Deserialize)]
struct WithdrawRevenueArgs {
    action: String, // Should be "withdrawCreatorRevenue"
    amount: u64,
}

// Constants for fee distribution
const CREATOR_SHARE_PERCENTAGE: u8 = 60; // 60% to creators
const PLATFORM_SHARE_PERCENTAGE: u8 = 40; // 40% to platform

#[system]
pub mod revenue_system {

    pub fn execute(ctx: Context<Components>, args_bytes: Vec<u8>) -> Result<Components> {
        // Parse the JSON arguments
        let args_str = std::str::from_utf8(&args_bytes).map_err(|_| SystemError::InvalidArgs)?;
        
        if args_str.contains("\"action\":\"distributeMatchRevenue\"") {
            let args: DistributeRevenueArgs = serde_json::from_str(args_str).map_err(|_| SystemError::InvalidArgs)?;
            return distribute_match_revenue(ctx, args);
        } else if args_str.contains("\"action\":\"withdrawCreatorRevenue\"") {
            let args: WithdrawRevenueArgs = serde_json::from_str(args_str).map_err(|_| SystemError::InvalidArgs)?;
            return withdraw_creator_revenue(ctx, args);
        } else {
            return Err(SystemError::UnknownAction.into());
        }
    }

    fn distribute_match_revenue(ctx: Context<Components>, args: DistributeRevenueArgs) -> Result<Components> {
        // Only admin/authority can distribute revenue
        // In a real implementation, you might have a more complex admin system
        
        // Calculate creator share
        let creator_share = (args.total_fees as u128 * CREATOR_SHARE_PERCENTAGE as u128 / 100) as u64;
        
        // Calculate platform share (remaining amount)
        let platform_share = args.total_fees.saturating_sub(creator_share);
        
        // In a real implementation, transfer platform_share to a platform treasury account
        msg!("Platform revenue: {} lamports", platform_share);
        
        // Distribute creator revenue if creator accounts provided
        if let Some(creator_revenues) = &mut ctx.accounts.creator_revenues {
            // Simple distribution: equally split among all creators
            // In a real implementation, you might distribute based on usage or other metrics
            if !creator_revenues.is_empty() {
                let per_creator_amount = creator_share / creator_revenues.len() as u64;
                
                for creator_revenue in creator_revenues {
                    // Add revenue to creator
                    creator_revenue.add_revenue(args.match_id.clone(), per_creator_amount)?;
                    msg!("Creator earned: {} lamports", per_creator_amount);
                }
            }
        }
        
        Ok(ctx.accounts)
    }
    
    fn withdraw_creator_revenue(ctx: Context<Components>, args: WithdrawRevenueArgs) -> Result<Components> {
        // Get creator revenue account
        let creator_revenue = &mut ctx.accounts.creator_revenue;
        
        // Verify authority is the creator
        require!(
            creator_revenue.creator == ctx.system_context.authority,
            SystemError::NotAuthorized
        );
        
        // Process withdrawal (in a real implementation, this would involve a SOL transfer)
        creator_revenue.withdraw_revenue(args.amount)?;
        
        msg!("Creator withdrew: {} lamports", args.amount);
        
        Ok(ctx.accounts)
    }

    #[system_input]
    pub struct Components {
        pub creator_revenue: Option<CreatorRevenue>,
        pub creator_revenues: Option<Vec<CreatorRevenue>>,
    }
}

#[error_code]
pub enum SystemError {
    #[msg("Invalid arguments format")]
    InvalidArgs,
    
    #[msg("Unknown action")]
    UnknownAction,
    
    #[msg("Not authorized to perform this action")]
    NotAuthorized,
}