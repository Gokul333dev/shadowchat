const matchManager = require('../matchManager');

module.exports = (bot) =>{
    bot.command("next",async(ctx)=>{
        const userId = ctx.from.id;
        const partnerId = matchManager.EndChat(userId);

        if(partnerId){
            await ctx.telegram.sendMessage(partnerId, "❌ Your partner has left the chat.");
            ctx.reply("🔄 Left the chat. Finding you a new partner...");
        }
        // else{
        //     ctx.reply("🔄 Searching for a new partner...");
        // }

        if (matchManager.IsSearching(userId)) {
            return ctx.reply("🔍 You're already searching for a partner. Please wait...");
        }

        const newPartner = matchManager.FindMatch(userId);

        if(newPartner){
            await ctx.telegram.sendMessage(newPartner, "✅ You’ve been matched! Say hi!");
            await ctx.reply("✅ You’ve been matched! Say hi!");
        }
        else{
            matchManager.AddUserToQueue(userId);
            // console.log(matchManager.waitingQueue);
            await ctx.reply("🔍 Searching for a partner... Please wait.");
        }
    })
}