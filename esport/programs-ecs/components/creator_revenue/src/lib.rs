use bolt_lang::*;
use solana_program::pubkey::Pubkey;

// You'll need to replace this with an actual program ID when deploying
declare_id!("11111111111111111111111111111111");

// Revenue tracking for a specific match
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct RevenueEntry {
    #[max_len(50)]
    pub match_id: String,
    pub amount: u64,
    pub timestamp: i64,
}

#[component]
#[derive(Default)]
pub struct CreatorRevenue {
    pub creator: Pubkey,
    pub nft_mint: Pubkey,
    pub total_earned: u64,
    pub total_withdrawn: u64,
    pub last_withdrawal_timestamp: i64,
    #[max_len(50)]
    pub revenue_history: Vec<RevenueEntry>,
}

#[component_methods]
impl CreatorRevenue {
    pub fn initialize(
        &mut self,
        creator: Pubkey,
        nft_mint: Pubkey,
    ) -> Result<()> {
        self.creator = creator;
        self.nft_mint = nft_mint;
        self.total_earned = 0;
        self.total_withdrawn = 0;
        self.last_withdrawal_timestamp = 0;
        
        Ok(())
    }
    
    pub fn add_revenue(
        &mut self,
        match_id: String,
        amount: u64,
    ) -> Result<()> {
        // Add to total earnings
        self.total_earned = self.total_earned.checked_add(amount).unwrap();
        
        // Add to revenue history
        self.revenue_history.push(RevenueEntry {
            match_id,
            amount,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }
    
    pub fn withdraw_revenue(
        &mut self,
        amount: u64,
    ) -> Result<()> {
        // Check if enough available
        let available = self.total_earned.saturating_sub(self.total_withdrawn);
        require!(amount <= available, RevenueError::InsufficientFunds);
        
        // Update withdrawal amount
        self.total_withdrawn = self.total_withdrawn.checked_add(amount).unwrap();
        self.last_withdrawal_timestamp = Clock::get()?.unix_timestamp;
        
        Ok(())
    }
    
    pub fn get_available_revenue(&self) -> u64 {
        self.total_earned.saturating_sub(self.total_withdrawn)
    }
}

#[error_code]
pub enum RevenueError {
    #[msg("Insufficient funds for withdrawal")]
    InsufficientFunds,
}