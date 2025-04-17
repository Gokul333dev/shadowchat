const matchManager = require('../matchManager')

module.exports = (bot) =>{
    bot.command("end",async(ctx)=>{
        const userId = ctx.from.id;

        if(matchManager.IsSearching(userId)){
            matchManager.stopSearching(userId);

            return ctx.reply("❌ Stopped Searching");
        }
        
        const partnerId = matchManager.EndChat(userId);


        if(partnerId){
            await ctx.telegram.sendMessage(partnerId, "❌ The chat has been ended by your partner.");
            return ctx.reply("❌ You’ve ended the chat.");
        }

        if(matchManager.IsSearching(userId)){
            matchManager.RemoveUserFromQueue(userId);
            return ctx.reply("🛑 You’ve stopped searching for a partner.");
        }

        return ctx.reply("⚠️ You're not in a chat or searching.");
    })
}