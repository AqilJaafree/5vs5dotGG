// match_queue.rs
use bolt_lang::*;

declare_id!("CHUtz6R1YRSYVRf56i4jefH4EiLMGFTx4TuSXa9SfhAy");

// Pending match struct for storage
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, InitSpace)]
pub struct PendingMatch {
    pub team1: Pubkey,
    pub team2: Pubkey,
    #[max_len(20)]
    pub match_type: String,
    pub timestamp: i64,
}

// Component definition for match queue
#[component]
#[derive(Default)]
pub struct MatchQueue {
    #[max_len(20)]
    pub pending_matches: Vec<PendingMatch>,
}