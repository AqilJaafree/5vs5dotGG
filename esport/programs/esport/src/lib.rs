use bolt_lang::prelude::*;

declare_id!("3h171djVn6LDR1JGHfMvg3HtZM96Vmjg95MJ4Zs5AFYg");

#[program]
pub mod esport {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
