const bot_name = '@' + process.env.TELEGRAM_BOT_USER_NAME;

function cutTextCommand(text, command) {
  if (text.indexOf(bot_name) === command.length + 1) {
      return text.slice(command.length + 1 + bot_name.length).trim();
  } else {
      return text.slice(command.length + 1).trim();
  }
}