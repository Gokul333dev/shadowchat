module.exports = (bot) =>{
    bot.command('start',(ctx)=>{
        ctx.reply("Welcome to Shadow Chat! Use /search to find a partner and /stop to leave.");
    })
}