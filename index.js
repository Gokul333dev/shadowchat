const bot = require('./bot');

bot.telegram.setMyCommands([
    { command: 'start', description: 'Start the bot' },
    { command: 'search', description: 'Search for a Partner' },
    { command: 'joingroup', description: 'Join a Random Group' },
    { command: 'leavegroup', description: 'Leave the Current Group' },
    { command: 'next', description: 'Skip to the next partner' },
    { command: 'end', description: 'End the Current Chat' },
    // { command: 'message', description: 'Start the bot' },
])

const matchManager = require('./handlers/matchManager')
const groupManager = require('./handlers/groupManager');

require('./handlers/commands/start')(bot);
require('./handlers/commands/search')(bot);
require('./handlers/commands/stop')(bot);
require('./handlers/commands/next')(bot);
require('./handlers/commands/joingroup')(bot);
require('./handlers/commands/leavegroup')(bot);
const { handlePrivateMessage, handleGroupMessage } = require('./handlers/messages/message');

bot.on('message',async(ctx)=>{
    const userId = ctx.from.id;

    if(matchManager.GetPartner(userId)){
        handlePrivateMessage(ctx,userId);
    }

    else if(groupManager.getGroupOfUser(userId)){
        handleGroupMessage(ctx,userId);
    }

    else{
        await ctx.reply("❗ You're not in any chat or group. Use /search or /joingroup to begin.");
    }

})

bot.launch();
console.log('Bot is successfully running');