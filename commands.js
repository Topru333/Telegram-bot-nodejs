const util = require('./util');

const Extra = require('telegraf/extra')

function setCommands(bot) {
  bot.command('alive', (ctx) => ctx.reply('Я жива, все ок.'));
  bot.command(check.name, (ctx) => check.do(ctx));
  bot.command(test.name, (ctx) => test.do(ctx));
}

const commands = {
  check: {
    do: function (ctx) {
      try {
        let result;
        let procent = ('' + (Math.random() * 100)).split(".")[0] + '%';
        let text = util.cutTextCommand(ctx.message.text, check.name);

        if (!text) {
          result = 'Пустой запрос, бака не спамь o(≧口≦)o o(≧口≦)o o(≧口≦)o';
          return;
        }

        if (ctx.message.entities.length > 1 && (ctx.message.entities[1].type === 'text_mention' || ctx.message.entities[1].type === 'mention')) {
          if (ctx.message.entities[1].type === 'text_mention') {
            text = text.replace(ctx.message.entities[1].user.first_name, ('<a href="tg://user?id=' + ctx.message.entities[1].user.id + '">' + ctx.message.entities[1].user.first_name + '</a>'));
          }
          result = text + ' на ' + procent;
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
  },
  test: {
    do: function (ctx)  {
      //ctx.reply(JSON.stringify(ctx.message, null, 4));
      ctx.reply(arguments.callee.toString());
    }
  },
  search: {
    do: function (ctx)  {
      let text = util.cutTextCommand(ctx.message.text, search.name);
    }
  }
};

module.exports.setCommands = setCommands;
