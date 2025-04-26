use bolt_lang::*;

declare_id!("EXBnodEG8GnhJwipqupBMMk8Cd3CRdXEgrXCh7Jd9KNv");

#[component]
#[derive(Default)]
pub struct Position {
    pub x: i64,
    pub y: i64,
    pub z: i64,
    #[max_len(20)]
    pub description: String,
}