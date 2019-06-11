const Telegraf = require('telegraf')

// Bot TOKEN
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)

const appName = process.env.PROJECT_NAME
const appPort = process.env.PORT

// Set Webhook
bot.telegram.setWebhook(`https://${appName}.glitch.me/webhook`)

bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username
})

// Start builtin Webhook
bot.startWebhook('/webhook', null, appPort)

// Listener
//bot.on('text', (ctx) => ctx.reply('Hello Human'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.command('help', (ctx) => ctx.replyWithMarkdown(helpResponse));

console.log(`Listening incoming webhook on: https://${appName}.glitch.me/webhook`)
