const util = require('./util');
const request = require('request');

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
      ctx.replyWithHTML(result);
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
    let url = `https://www.googleapis.com/customsearch/v1?key=${api_key}&cx=${cx}&q=${text.split(' ').join('+')}`;
    request.get(url, (error, response, body) => {
      if (error) {
        console.error('Handle error, was problem with search api. Can be problem with quotas.');
        console.error(JSON.stringify(error));
        ctx.reply('Handle error, please check logs.');
        return;
      }
      if (!response || response.statusCode != 200) {
        console.error('Handle response code error, was problem with search api. Can be problem with quotas.');
        console.error(JSON.stringify(response));
        ctx.reply('Handle response code error, please check logs.');
        return;
      }
      let response_result = JSON.parse(body);
      
      let link = response_result.items[0].link;
      let name = response_result.items[0].title;
      let text = `<a href="${link}">${name}</a>`;
      ctx.webhookReply = false;
      ctx.replyWithHTML(text, Object.assign({ 'reply_to_message_id': ctx.message.message_id }));
    });
  }
});

module.exports.setCommands = setCommands;
