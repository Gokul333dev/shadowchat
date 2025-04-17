const groupManager = require('../groupManager');
const matchManager = require('../matchManager');

module.exports = (bot) =>{
    bot.command('joingroup',async(ctx)=>{
        const userId = ctx.from.id;

        if(groupManager.getGroupOfUser(userId)){
            return ctx.reply("👥 You're already in a group.")
        }

        if(matchManager.GetPartner(userId)){
            return ctx.reply("💬 You're already in a chat. Use /end to end the current conversation.")
        }

        if(matchManager.IsSearching(userId)){
            return ctx.reply("🔍 You're already searching for a partner. Please wait...");
        }

        const newGroupId = groupManager.addUserToPendingGroup(userId);

        if(newGroupId){
            const {groupId,members,labels} = groupManager.getGroupOfUser(userId);

            members.forEach(member => {
                if(member!=userId){
                    bot.telegram.sendMessage(member, `✅ A new group has been formed! You Are ${labels[member]}! Say hi to your new friends.`);
                }
            });
            ctx.reply(`✅ A new group has been formed! You are ${labels[userId]}! Say hi to your new friends.`);
        }

        else{
            ctx.reply("🚀 Group created! Waiting for others to join...");
        }


        // groupManager.createGroup([userId]);
        // await ctx.reply("🚀 Group created! Waiting for others to join...");
    })
}