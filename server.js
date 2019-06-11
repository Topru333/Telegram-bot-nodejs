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
bot.hears('сука', (ctx) => ctx.reply('блять'));
bot.command('help', (ctx) => ctx.reply('я бот на замену, только оригу не говорите плиз'));

console.log(`Listening incoming webhook on: https://${appName}.glitch.me/webhook`)
