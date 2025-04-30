use bolt_lang::*;
use solana_program::pubkey::Pubkey;

// You'll need to replace this with an actual program ID when deploying
declare_id!("11111111111111111111111111111111");

#[component]
#[derive(Default)]
pub struct TeamStake {
    pub team_entity: Pubkey,
    pub staker: Pubkey,
    pub staked_amount: u64,
    pub stake_timestamp: i64,
    pub last_reward_timestamp: i64,
    pub locked: bool,
}

// Replace component_methods with regular impl
impl TeamStake {
    pub fn initialize(
        &mut self,
        team_entity: Pubkey,
        staker: Pubkey,
    ) -> Result<()> {
        self.team_entity = team_entity;
        self.staker = staker;
        self.staked_amount = 0;
        self.stake_timestamp = Clock::get()?.unix_timestamp;
        self.last_reward_timestamp = self.stake_timestamp;
        self.locked = false;
        
        Ok(())
    }
    
    pub fn stake(
        &mut self,
        amount: u64,
    ) -> Result<()> {
        // Cannot stake to locked stake account
        require!(!self.locked, StakeError::StakeLocked);
        
        // Add to staked amount
        self.staked_amount = self.staked_amount.checked_add(amount).unwrap();
        
        Ok(())
    }
    
    pub fn unstake(
        &mut self,
    ) -> Result<u64> {
        // Cannot unstake from locked stake account
        require!(!self.locked, StakeError::StakeLocked);
        
        // Get current staked amount
        let amount = self.staked_amount;
        
        // Reset staked amount
        self.staked_amount = 0;
        
        Ok(amount)
    }
    
    pub fn lock_stake(
        &mut self,
    ) -> Result<()> {
        require!(!self.locked, StakeError::StakeAlreadyLocked);
        self.locked = true;
        Ok(())
    }
    
    pub fn unlock_stake(
        &mut self,
    ) -> Result<()> {
        require!(self.locked, StakeError::StakeAlreadyUnlocked);
        self.locked = false;
        Ok(())
    }
    
    pub fn update_reward_timestamp(
        &mut self,
    ) -> Result<()> {
        self.last_reward_timestamp = Clock::get()?.unix_timestamp;
        Ok(())
    }
}

#[error_code]
pub enum StakeError {
    #[msg("Stake is locked and cannot be modified")]
    StakeLocked,
    
    #[msg("Stake is already locked")]
    StakeAlreadyLocked,
    
    #[msg("Stake is already unlocked")]
    StakeAlreadyUnlocked,
}