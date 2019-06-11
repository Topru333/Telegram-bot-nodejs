function setCommands(bot) {
  bot.command('alive', (ctx) => ctx.reply('Я жива, все ок.'));
  bot.command('check', (ctx) => check(ctx));

}

let check = function (ctx) {
  let result;
  var procent = ('' + (Math.random() * 100)).split(".")[0] + '%';
  var text;
  if (ctx.message.text.indexOf('@weeb_bot_bot') === 6) {
    text = ctx.message.text.slice(19).trim();
  } else {
    text = ctx.message.text.slice(6).trim();
  }
  
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
    result = '<a href="tg://user?id=' + ctx.message.from.id + '">' + ctx.message.from.first_name + '</a> ' + text + ' на <b>' + procent + '</b>';
  }
  
  ctx.reply(result);
}