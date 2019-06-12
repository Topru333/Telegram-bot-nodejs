const util = require('./util');

const Extra = require('telegraf/extra')

function setCommands(bot) {
  bot.command('wot', (ctx) => ctx.reply('hot'));
  for (let i in commands) {
    bot.command(commands[i].name, (ctx) => commands[i].do(ctx));
  }
}

const commands = [];

commands.push({
  name: 'alive',
  do: function (ctx) {
    ctx.reply('Я жива, все ок.');
  }
});

commands.push({
  name: 'check',
  do: function (ctx) {
    try {
      let result;
      let procent = ('' + (Math.random() * 100)).split(".")[0] + '%';
      let text = util.cutTextCommand(ctx.message.text, this.name);

      if (!text) {
        result = 'Пустой запрос, бака не спамь o(≧口≦)o o(≧口≦)o o(≧口≦)o';
        return;
      }

      if (ctx.message.entities.length > 1 && (ctx.message.entities[1].type === 'text_mention' || ctx.message.entities[1].type === 'mention')) {
        if (ctx.message.entities[1].type === 'text_mention') {
          text = text.replace(ctx.message.entities[1].user.first_name, ('<a href="tg://user?id=' + ctx.message.entities[1].user.id + '">' + ctx.message.entities[1].user.first_name + '</a>'));
        }
        result = `${text} на ${procent}`;
      }
      else {
        result = `<a href="tg://user?id=${ctx.message.from.id }"> ${ctx.message.from.first_name}</a> ${text} на <b>${procent}</b>`;
      }
      ctx.parse_mode = 'HTML';
      ctx.reply(result, Extra.HTML());
      }
    catch (e) {
      console.log('Ooops', e)
    }
  }
});

commands.push({
  name: 'test',
  do: function (ctx)  {
    if (ctx.message.reply_to_message) {
      ctx.reply(JSON.stringify(ctx.message.reply_to_message, null, 4));
    } else {
      ctx.reply(JSON.stringify(ctx.message, null, 4));
    }
  }
});

commands.push({
  name: 'search',
  do: function (ctx)  {
    let text = util.cutTextCommand(ctx.message.text, this.name);
    let api_key = process.env.GOOGLE_SEARCH_API_KEY;
    let cx = process.env.GOOGLE_SEARCH_CX;
    let url = `https://www.googleapis.com/customsearch/v1?key=${api_key}&cx=${cx}&q=${text.split(' ').join('+')}}`;
  }
});

module.exports.setCommands = setCommands;
