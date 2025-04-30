use bolt_lang::*;
use solana_program::pubkey::Pubkey;

// You'll need to replace this with an actual program ID when deploying
declare_id!("11111111111111111111111111111111");

#[component]
#[derive(Default)]
pub struct PlayerStats {
    pub nft_mint: Pubkey,
    #[max_len(20)]
    pub role: String,
    pub mechanical: u8,         // 0-100 stat for mechanical skill
    pub game_knowledge: u8,     // 0-100 stat for game knowledge
    pub team_communication: u8, // 0-100 stat for team communication
    pub adaptability: u8,       // 0-100 stat for adaptability
    pub consistency: u8,        // 0-100 stat for consistency
    pub form: u8,               // 0-100 stat for current form (can change)
    pub potential: u8,          // 0-100 stat for long-term potential
    pub matches_played: u32,
    pub wins: u32,
    pub losses: u32,
}

// Instruction handlers for initializing and updating player stats
#[component_methods]
impl PlayerStats {
    pub fn initialize_stats(
        &mut self,
        nft_mint: Pubkey,
        role: String,
        mechanical: u8,
        game_knowledge: u8,
        team_communication: u8,
        adaptability: u8,
        consistency: u8,
        form: u8,
        potential: u8,
    ) -> Result<()> {
        // Validate attribute ranges (0-100)
        require!(mechanical <= 100, ComponentError::InvalidAttribute);
        require!(game_knowledge <= 100, ComponentError::InvalidAttribute);
        require!(team_communication <= 100, ComponentError::InvalidAttribute);
        require!(adaptability <= 100, ComponentError::InvalidAttribute);
        require!(consistency <= 100, ComponentError::InvalidAttribute);
        require!(form <= 100, ComponentError::InvalidAttribute);
        require!(potential <= 100, ComponentError::InvalidAttribute);
        
        self.nft_mint = nft_mint;
        self.role = role;
        self.mechanical = mechanical;
        self.game_knowledge = game_knowledge;
        self.team_communication = team_communication;
        self.adaptability = adaptability;
        self.consistency = consistency;
        self.form = form;
        self.potential = potential;
        self.matches_played = 0;
        self.wins = 0;
        self.losses = 0;
        
        Ok(())
    }
    
    pub fn update_form(&mut self, new_form: u8) -> Result<()> {
        // Only owner or authorized systems should update form
        require!(new_form <= 100, ComponentError::InvalidAttribute);
        self.form = new_form;
        Ok(())
    }
    
    pub fn record_match_result(&mut self, win: bool) -> Result<()> {
        self.matches_played += 1;
        if win {
            self.wins += 1;
        } else {
            self.losses += 1;
        }
        Ok(())
    }
}

// Custom errors for the component
#[error_code]
pub enum ComponentError {
    #[msg("Attribute value must be between 0 and 100")]
    InvalidAttribute,
}