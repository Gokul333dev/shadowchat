const matchManager = require('../matchManager')
const groupManager = require('../groupManager');

module.exports = (bot) =>{
    bot.command("search",async(ctx)=>{

        const userId = ctx.from.id;

        //Checks if the user is already in a chat
        if(matchManager.GetPartner(userId)){
            return ctx.reply("💬 You're already in a chat. Use /end to end the current conversation.")
        }

        //checks if the user is already searching for a partner
        if(matchManager.IsSearching(userId)){
            return ctx.reply("🔍 You're already searching for a partner. Please wait...");
        }

        if(groupManager.getGroupOfUser(userId)){
            return ctx.reply("👥You're already in a group Chat. Use /leavegroup to leave the current group.")
        }

        const partnerId = matchManager.FindMatch(userId);

        //if the matching is successfull , send a greeting message to both the users
        if(partnerId){
            await ctx.telegram.sendMessage(partnerId, "✅ You’ve been matched! Say hi!");
            await ctx.reply("✅ You’ve been matched! Say hi!");
        }

        //if the matching is not successfull , add the current user to the queue;
        else{
            matchManager.AddUserToQueue(userId);
            //console.log(matchManager.waitingQueue);
            await ctx.reply("🔍 Searching for a partner... Please wait.");
        }

    })
}