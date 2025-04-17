const groupManager = require('../groupManager');

module.exports = (bot) =>{
    bot.command('leavegroup',async(ctx)=>{
        const userId = ctx.from.id;

        const groupInfo = groupManager.getGroupOfUser(userId);

        if(groupManager.isSearching(userId)){
            groupManager.stopGroupSearch(userId);
            return ctx.reply("❌ Group Search Has Ended.")
        }

        if(!groupInfo) {
            return ctx.reply("❌ You are not in a group.");
        }

        groupInfo.members.forEach(member=>{
            if(member != userId){
                bot.telegram.sendMessage(member, "🚪 A member has left the group.");
            }
        })

        groupManager.leaveGroup(userId);
        await ctx.reply("👋 You have left the group.");
    })
}