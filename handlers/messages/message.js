// const bot = require('../../bot');
const matchManager = require('../matchManager');
const groupManager = require('../groupManager');

const handlePrivateMessage = async(ctx,userId) =>{
    const partnerId = matchManager.GetPartner(userId);

    if(partnerId){
        // const text = getMessageContent(ctx.message);

        return forwardContent(ctx,partnerId,"Stranger");
    }
}

const handleGroupMessage = async(ctx,userId)=>{
    const {groupId,members,labels} = groupManager.getGroupOfUser(userId);

    // const message = getMessageContent(ctx.message);
    if(groupId && members){
        for(let memberId of members){
            if(memberId != userId){
                forwardContent(ctx,memberId,labels[userId]);
            }
        }
    }
}
const forwardContent = async (ctx, targetUserId, senderLabel = null) => {
    const message = ctx.message;

    if (message.text) {
        const prefix = senderLabel ? `${senderLabel}: ` : '';
        await ctx.telegram.sendMessage(targetUserId, `${prefix}${message.text}`);
    } else if (message.sticker) {
        if (senderLabel) {
            await ctx.telegram.sendMessage(targetUserId, `${senderLabel}:`);
        }
        await ctx.telegram.sendSticker(targetUserId, message.sticker.file_id);
    } else if (message.photo) {
        if (senderLabel) {
            await ctx.telegram.sendMessage(targetUserId, `${senderLabel}:`);
        }
        const highestResPhoto = message.photo[message.photo.length - 1];
        await ctx.telegram.sendPhoto(targetUserId, highestResPhoto.file_id);
    } else if (message.animation) {
        if (senderLabel) {
            await ctx.telegram.sendMessage(targetUserId, `${senderLabel}:`);
        }
        await ctx.telegram.sendAnimation(targetUserId, message.animation.file_id);
    } else {
        await ctx.telegram.sendMessage(targetUserId, `${senderLabel || ''}: Unsupported message type.`);
    }
};


  module.exports = {
    handleGroupMessage,
    handlePrivateMessage
  };