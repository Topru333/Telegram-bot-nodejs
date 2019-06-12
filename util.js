const bot_name = '@' + process.env.TELEGRAM_BOT_USER_NAME;

function cutTextCommand(text, command) {
  if (text.indexOf(bot_name) === command.length + 1) {
      return text.slice(command.length + 1 + bot_name.length).trim();
  } else {
      return text.slice(command.length + 1).trim();
  }
}

function checkError(ctx, response, error, type) {
  if (error) {
    console.error(`Handle error, was problem with ${type}.`);
    console.error(JSON.stringify(error));
    ctx.reply('Handle error, please check logs.');
    return true;
  }
      
  if (!response || response.statusCode != 200) {
    console.error(`Handle response code error, was problem with ${type}.`);
    console.error(JSON.stringify(response));
    ctx.reply('Handle response code error, please check logs.');
    return true;
  }
  return false;
}

module.exports.cutTextCommand = cutTextCommand;
