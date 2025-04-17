require("dotenv").config()

const {Telegraf, Markup} = require("telegraf")

const queue = []
const partner = new Map();
const refferal = {}
const points = {}
const welcomeMessage = `
<b>👋 Welcome to ShadowChat!</b>

You're now part of a place where strangers connect, chat, and vibe — anonymously.

<b>Commands to get started:</b>
🔍 <b>/search</b> – Find a random chat partner  
⛔️ <b>/stop</b> – End the current chat  
📨 <b>/refer</b> – Invite a friend and earn points  
⭐ <b>/points</b> – Display Your Current Points  

Enjoy meaningful (or chaotic 😅) convos — we don’t judge. Stay kind. Stay anonymous.
`;

const userPreference = {}
const userStates = {};


const bot = new Telegraf(process.env.BOT_TOKEN);

bot.telegram.setMyCommands([
    { command: 'start', description: 'Start the bot' },
    { command: 'search', description: 'Find a chat partner' },
    { command: 'stop', description: 'End the current chat' },
    { command: 'points', description: 'Display your current points' },
    { command: 'refer', description: 'Get Your Referral Link' },
    // { command: 'settings', description: 'Open Settings Panel' }
]);  

const ensureUserId = (userId) =>{
    if(!userPreference[userId])
    {
        userPreference[userId]={InterestMatching:false,Interest:[]}
    }
}

bot.start((ctx)=>{
    const userId = ctx.from.id;

    if(userId === '7572946646'){
        ctx.reply("Start Learning Something lol! Enough scrolling");
    }
    const message = ctx.message.text;
    const parts = message.split(" ");

    let pl = null;
    if(parts.length >1){
        pl = parts[1];
    }

    if(pl && !refferal[pl]){
        const refId = parseInt(pl);
        if(refId !== userId){
            refferal[userId] = pl;

            points[refId] = (points[refId]||0)+1;

            bot.telegram.sendMessage(refId,"🎉 Someone joined using your referral! +1 point");
        }
    }

    console.log(ctx.from.id);
    ctx.reply(welcomeMessage,{parse_mode:'HTML'});
});

bot.command('search',(ctx)=>{
    const userId = ctx.from.id;

    if(partner.has(userId)){
        ctx.reply("You are already in a chat");
        return;
    }

    if(queue.includes(userId)){
        ctx.reply("You are already searching for a user");
        return;
    }

    queue.push(userId);
    ctx.reply("Searching for a user");

    if(queue.length>=2){
        const userA = queue.shift();
        const userB = queue.shift();

        partner.set(userA, userB);
        partner.set(userB, userA);

        bot.telegram.sendMessage(userA,"You have been matched with a user");
        bot.telegram.sendMessage(userB,"You have been matched with a user");
    }
});

bot.command('stop',(ctx)=>{
    const userId = ctx.from.id;

    const partnerId = partner.get(userId);

    if(!partnerId){
        ctx.reply("You are not in a chat");
        return;
    }

    bot.telegram.sendMessage(partnerId,"Your partner has left the chat");
    ctx.reply("You have left the chat");

    partner.delete(userId);
    partner.delete(partnerId);
})

bot.command('points',(ctx)=>{
    const userId = ctx.from.id;
    const userPoints = points[userId]||0;
    ctx.reply(`⭐ You have ${userPoints} points.`)
})

bot.command('refer',(ctx)=>{
    const userId = ctx.from.id;

    const reflink = `https://t.me/Xhadow_bot?start=${userId}`;
    ctx.reply(`🎉 Invite your friends and get 5 tokens for FREE!\n🔗 Share this link with friends:\n${reflink}`);
})
//Need to take care of this Later - Settings
// const handleSettings = (ctx)=>{
//     const userId = ctx.from.id;
//     const preference = userPreference[userId] || {InterestMatching:false,Interest:[]}

//     const InterestMatchingStatus = preference.InterestMatching ? "✅ Enabled" : "❌ Disabled";

//     ctx.reply(`⚙️ Settings Menu`,
//         {
//             parse_mode : 'Markdown',
//             ...Markup.inlineKeyboard([
//                 [Markup.button.callback("💡Interest Settings", "interest_settings")],
//             ]),
//         }
//     );
// };

// bot.command("settings", handleSettings);

// bot.action('interest_settings',(ctx)=>{
//     ctx.editMessageText("Interest Settings",{
//         parse_mode:"Markdown",
//         ...Markup.inlineKeyboard([
//             [Markup.button.callback("🎯 Toggle Interest Matching", "toggle_interest_matching")],
//             [Markup.button.callback("📝 Set My Interests", "set_interests")],
//             [Markup.button.callback("👁️ List My Interests", "list_interests")],
//             [Markup.button.callback("🔄 Clear Interests", "clear_interests")],
//             [Markup.button.callback("⬅️ Back to Settings", "back_settings")]
//         ])
//     })
// })

// bot.action("back_settings",(ctx)=>{
//     const userId = ctx.from.id;

//     userStates[userId] = false;
//     ctx.reply(`⚙️ Settings Menu`,
//         {
//             parse_mode : 'Markdown',
//             ...Markup.inlineKeyboard([
//                 [Markup.button.callback("💡Interest Settings", "interest_settings")],
//             ]),
//         }
//     );
// })

// bot.action('toggle_interest_matching',async (ctx)=>{
//     const userId = ctx.from.id;

//     if(!userPreference[userId]){
//         userPreference[userId] = {InterestMatching:false,Interest:[]}
//     }

//     userPreference[userId].InterestMatching = !userPreference[userId].InterestMatching;

//     await ctx.answerCbQuery(`Interest-Based Matching ${userPreference[userId].InterestMatching ?"✅ Enabled" : "❌ Disabled" }`);
    
//     ctx.deleteMessage();

//     handleSettings(ctx);
// })

// bot.action('set_interests',async(ctx)=>{
//     const userId = ctx.from.id;
//     await ctx.answerCbQuery("Please Enter Your Interests");
//     await ctx.reply( `Please *type your interests*, separated by commas (e.g. "music, coding, anime")`,
//     { parse_mode: "Markdown" })

//     userStates[userId] = true;
// })

// bot.on("text",async(ctx)=>{
//     const userId = ctx.from.id;

//     if(userStates[userId]){
//         const text = ctx.message.text;

//         ensureUserId(userId);
//         userPreference[userId].Interest = text.split(",").map(i => i.trim()).filter(i => i.length > 0);
//         // userPreference[userId].Interest = parts;

//         await ctx.reply(`✅ Your interests have been saved:\n${userPreference[userId].Interest.join(", ")}`);

//         userStates[userId] = false;
//     }
//     else{
//         ctx.reply("You are not in a chat");
//     }
// })

// bot.action("clear_interests",(ctx)=>{
//     const userId = ctx.from.id;

//     ensureUserId(userId);

//     userPreference[userId].Interest = [];

//     ctx.answerCbQuery("Intrests Cleared");
// })

bot.on('message',(ctx)=>{
    const userId = ctx.from.id;
    const partnerId = partner.get(userId);

    if(!partnerId){
        ctx.reply("You are not in a Chat");
        return;
    }

    const txt = ctx.message;

    if(txt.text){
        bot.telegram.sendMessage(partnerId,txt.text);
    }

    if(txt.animation){
        bot.telegram.sendAnimation(partnerId,txt.animation.file_id);
    }
})


bot.launch();

console.log("Bot is successfully running");