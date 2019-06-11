function setCommands(bot) {
  bot.command('alive', (ctx) => ctx.reply('Я жива, все ок.'));

}

let check = function (msg, contents) {
  let result;
  var procent = ('' + (Math.random() * 100)).split(".")[0] + '%';
  var text;
  if (contents.message.text.indexOf('@weeb_bot_bot') === 6) {
    text = contents.message.text.slice(19).trim();
  } else {
    text = contents.message.text.slice(6).trim();
  }
  
  if (!text) {
    result = 'Пустой запрос, бака не спамь o(≧口≦)o o(≧口≦)o o(≧口≦)o';
    return;
  }
    
  if (contents.message.entities.length > 1 && (contents.message.entities[1].type === 'text_mention' || contents.message.entities[1].type === 'mention')) {
    if (contents.message.entities[1].type === 'text_mention') {
      text = text.replace(contents.message.entities[1].user.first_name, ('<a href="tg://user?id=' + contents.message.entities[1].user.id + '">' + contents.message.entities[1].user.first_name + '</a>'));
    }
    result = text + ' на ' + procent;
  }
  else {
    result = '<a href="tg://user?id=' + contents.message.from.id + '">' + contents.message.from.first_name + '</a> ' + text + ' на <b>' + procent + '</b>';
  }
  return result;
}