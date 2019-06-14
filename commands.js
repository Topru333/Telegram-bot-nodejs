const util = require('./util');
const request = require('request');

const Extra = require('telegraf/extra')

const commands = [];
const muted_users = [];

const empty_error = 'Пустой запрос, бака не спамь o(≧口≦)o o(≧口≦)o o(≧口≦)o';

let bot;

function setBot(_bot) {
  bot = _bot;
}

function setCommands() {
  for (let i in commands) {
    bot.command(commands[i].name, (ctx) => {
      if (ctx.message && muted_users.indexOf(ctx.message.from.id) != -1){
        ctx.deleteMessage(ctx.message.message_id);
      } else {
        commands[i].do(ctx)
      }
    });
  }
}

function setBindings() {
  bot.use((ctx, next) => {
    if (ctx.message && muted_users.indexOf(ctx.message.from.id) != -1){
      ctx.deleteMessage(ctx.message.message_id);
    } else {
      next();
    }
  });

  let url = process.env.GOOGLE_SHEETS_BINDINGS_URL;
  request.get(url, (error, response, body) => {
    let commands = JSON.parse(body).commands;
    for (let i in commands) {
      bind(commands[i]);
    }     
    console.log('Spreadsheet commands has bound.');
  });
}

function bind(command) {
  bot.use((ctx, next) => {
    if (ctx.message.text && ctx.message.text.toLowerCase().includes(command.key.toLowerCase())) {
      let extra = new Extra();
      if (command.text) {
        extra.caption = command.text;
      }

      if (command.pic) {
        ctx.replyWithPhoto(command.pic, extra);
      } else if (command.document) {
        ctx.replyWithDocument(command.document, extra);
      } else if (command.sticker) {
        ctx.replyWithSticker(command.sticker);
      } else {
        ctx.reply(command.text);
      }
    }
    next();
  });
}



commands.push({
  name: 'sheets',
  do: function (ctx) {
    return ctx.reply('https://docs.google.com/spreadsheets/d/1HgpzWnRJqi1YQZ1YxvPbUoJCnAFYCoD73l38eeBofdM/edit?usp=sharing');
  }
});

commands.push({
  name: 'alive',
  do: function (ctx) {
    return ctx.reply('Я жива, все ок.');
  }
});

commands.push({
  name: 'check',
  do: function (ctx) {
    let result;
    if (!ctx.message) {
      return;
    }
    
    let text = util.cutTextCommand(ctx.message.text, this.name);

    if (!text) {
      ctx.reply(empty_error);
      return;
    }

    let procent = ('' + (Math.random() * 100)).split(".")[0] + '%';
    
    if (ctx.message.entities.length > 1 && (ctx.message.entities[1].type === 'text_mention' || ctx.message.entities[1].type === 'mention')) {
      if (ctx.message.entities[1].type === 'text_mention') {
        text = text.replace(ctx.message.entities[1].user.first_name, ('<a href="tg://user?id=' + ctx.message.entities[1].user.id + '">' + ctx.message.entities[1].user.first_name + '</a>'));
      }
      result = `${text} на ${procent}`;
    }
    else {
      result = `<a href="tg://user?id=${ctx.message.from.id }"> ${ctx.message.from.first_name}</a> ${text} на <b>${procent}</b>`;
    }
    return ctx.replyWithHTML(result);
  }
});

commands.push({
  name: 'test',
  do: function (ctx)  {
    if (ctx.message.reply_to_message) {
      return ctx.reply(JSON.stringify(ctx.message.reply_to_message, null, 4));
    } else {
      return ctx.reply(JSON.stringify(ctx.message, null, 4));
    }
  }
});

commands.push({
  name: 'search',
  do: function (ctx)  {
    let text = util.cutTextCommand(ctx.message.text, this.name);
    if (!text) {
      ctx.reply(empty_error);
      return;
    }
    let api_key = process.env.GOOGLE_SEARCH_API_KEY;
    let cx = process.env.GOOGLE_SEARCH_CX;
    let url = `https://www.googleapis.com/customsearch/v1?key=${api_key}&cx=${cx}&q=${text.split(' ').join('+')}`;
    request.get(url, (error, response, body) => {
      util.checkError(ctx, response, error, 'search api. Can be problem with quotas');
      
      let response_result = JSON.parse(body);
      ctx.webhookReply = false;
      
      if (!response_result.items || response_result.items.length == 0) {
        return ctx.reply('0 results for current query', Object.assign({ 'reply_to_message_id': ctx.message.message_id }));
      } else {
        let link = response_result.items[0].link;
        let name = response_result.items[0].title;
        let extra = Extra.HTML(true);
        let text = `<a href="${link}">${name}</a>`;
        extra.reply_to_message_id = ctx.message.message_id;
        return ctx.replyWithHTML(text, extra);
      }
    });
  }
});

commands.push({
  name: 'pic',
  do: function (ctx)  {
    let text = util.cutTextCommand(ctx.message.text, this.name);
    if (!text) {
      ctx.reply(empty_error);
      return;
    }
    let api_key = process.env.GOOGLE_SEARCH_API_KEY;
    let cx = process.env.GOOGLE_SEARCH_CX;
    let url = `https://www.googleapis.com/customsearch/v1?key=${api_key}&cx=${cx}&searchType=image&q=${text.split(' ').join('+')}`;
    request.get(url, (error, response, body) => {
      util.checkError(ctx, response, error, 'search api. Can be problem with quotas');

      let response_result = JSON.parse(body);
      ctx.webhookReply = false;
      
      if (!response_result.items || response_result.items.length == 0) {
        ctx.reply('0 results for current query', Object.assign({ 'reply_to_message_id': ctx.message.message_id }));
      } else {
        let max = response_result.items.length > 15 ? 15 : response_result.items.length;
        let index = Math.floor(Math.random() * max);
        
        let link = response_result.items[index].link;
        let name = response_result.items[index].title;
        let extra = Extra.HTML(true);
        extra.caption = `<a href="${link}">${name}</a>`;
        extra.reply_to_message_id = ctx.message.message_id;
        return ctx.replyWithPhoto(link, extra)
      }
    });
  }
});

commands.push({
  name: 'gfycat',
  do: function (ctx)  {
    let text = util.cutTextCommand(ctx.message.text, this.name);
    
    if (!text) {
      return ctx.reply(empty_error);
    }
    
    let url = `https://api.gfycat.com/v1/gfycats/search?search_text=${text.split(' ').join('+')}`;
    request.get(url, (error, response, body) => {
      util.checkError(ctx, response, error, 'gfycat api');
      
      let response_result = JSON.parse(body);
      ctx.webhookReply = false;
      
       
      if (!response_result.gfycats || response_result.gfycats.length == 0) {
        return ctx.reply('0 results for current query', Object.assign({ 'reply_to_message_id': ctx.message.message_id }));
      }

      let max = response_result.gfycats.length;
      let index = Math.floor(Math.random() * max);
      let link = response_result.gfycats[index].gifUrl;
      let extra = Extra.inReplyTo(ctx.message.message_id);
      return ctx.replyWithDocument(link, extra);
    });
  }
});

commands.push({
  name: 'giphy',
  do: function (ctx)  {
    let text = util.cutTextCommand(ctx.message.text, this.name);
    
    if (!text) {
      return ctx.reply(empty_error);
    }
    
    let api_key = process.env.GIPHY_API_KEY;
    let url = `http://api.giphy.com/v1/gifs/search?q=${text.split(' ').join('+')}&api_key=${api_key}`;
    request.get(url, (error, response, body) => {
      util.checkError(ctx, response, error, 'giphy api');
      
      let response_result = JSON.parse(body);
      ctx.webhookReply = false;
      
       
      if (!response_result.data || response_result.data.length == 0) {
        ctx.reply('0 results for current query', Object.assign({ 'reply_to_message_id': ctx.message.message_id }));
        return;
      }

      let max = response_result.data.length;
      let index = Math.floor(Math.random() * max);
      let link = response_result.data[index].images.original.url;
      let extra = Extra.inReplyTo(ctx.message.message_id);
      return ctx.replyWithDocument(link, extra);
    });
  }
});

commands.push({
  name: 'minecraft',
  do: function (ctx)  {
    let url = `https://api.mcsrvstat.us/2/alex-fk.servegame.com`;
    request.get(url, (error, response, body) => {
      util.checkError(ctx, response, error, 'mcsrvstat rest api');
      let response_result = JSON.parse(body);
      ctx.webhookReply = false;
      
      if (!response_result.online) {
        ctx.reply (`Server ${response_result.hostname} is ofline right now, please try later.`);
        return;
      }
      
      return ctx.replyWithHTML(decodeURI(`Server <em>${response_result.hostname}</em> is <b>online</b>. %0AVersion: <b>${response_result.version}</b> %0AOnline players: <b>${response_result.players.online}</b> %0AMap for server: http://${response_result.hostname}:8123/`));
    });
  }
});

commands.push({  
  name: 'everyone',
  do: function (ctx)  {
    ctx.telegram.getChatAdministrators(ctx.chat.id).then((users) => {
      ctx.webhookReply = false;
      let result = '';
      for (let i in users) {
        if (!users[i].user.is_bot) {
          result = `${result} <a href="tg://user?id=${users[i].user.id}">${users[i].user.first_name}</a>`;
        }
      }
      ctx.replyWithHTML(result, Object.assign({ 'reply_to_message_id': ctx.message.message_id }));
    });
    
  }
});

commands.push({
  name: 'mute',
  do: function (ctx) {
    if (ctx.message.chat.type === "private") {
      return ctx.reply('No selfcest for u my private friend :^)');
    }
    if (!ctx.message.reply_to_message) {
      return ctx.reply('Определись кого мутишь хоть.');
    }
    if (ctx.message.reply_to_message.from.id ===  parseInt(process.env.TELEGRAM_BOT_USER_ID)) {
      return ctx.reply('(Очко себе замуть, пёс> (╯°□°）╯︵ ┻━┻');
    }
    
    let extra = new Extra();
    extra.reply_to_message_id = ctx.message.reply_to_message.message_id;
    
    let index = muted_users.indexOf(ctx.message.reply_to_message.from.id);
    if (index != -1) {
      return ctx.reply('Он уже.', extra);
    }
    
    muted_users.push(ctx.message.reply_to_message.from.id);
    
    extra.caption = 'ZA WARUDO';
    return ctx.replyWithDocument('https://media2.giphy.com/media/nyNS6Cfrnkdj2/giphy.gif', extra);
  }
});

commands.push({
  name: 'unmute',
  do: function (ctx) {
    if (ctx.message.chat.type === "private") {
      return ctx.reply('No selfcest for u my private friend :^)');
    }
    if (!ctx.message.reply_to_message) {
      return ctx.reply('Определись кого освобождаешь хоть.');
    }
    if (ctx.message.reply_to_message.from.id ===  parseInt(process.env.TELEGRAM_BOT_USER_ID)) {
      return ctx.reply('(Очко себе замуть, пёс> (╯°□°）╯︵ ┻━┻');
    }
    
    let extra = new Extra();
    extra.reply_to_message_id = ctx.message.reply_to_message.message_id;
    
    let index = muted_users.indexOf(ctx.message.reply_to_message.from.id);
    if (index === -1) {
      return ctx.reply('Этого еще не трогала.', extra);
    }
    muted_users.splice(index, 1);

    return ctx.replyWithDocument('https://media1.tenor.com/images/da558adfcaaf7eedb607a6c282d123ae/tenor.gif?itemid=12243323', extra);
  }
});
вфывф
commands.push({
  name: 'bind',
  do: function (ctx) {
    if (!ctx.message.reply_to_message) {
      return ctx.reply('Не пойму что биндить, ответь на нуждный текст.');
    }
    if (ctx.message.reply_to_message.from.id ===  parseInt(process.env.TELEGRAM_BOT_USER_ID)) {
      return ctx.reply('(Нельзя> (╯°□°）╯︵ ┻━┻');
    }
    
    let text = util.cutTextCommand(ctx.message.text, this.name);
    if (!text || !ctx.message.reply_to_message) {
      return ctx.reply(empty_error);
    }
    
    let reply_text = ctx.message.reply_to_message.text;
    
    
    let url = process.env.GOOGLE_SHEETS_BINDINGS_URL;
    let query = `?operation=add&key=${text}&type=text&text=${reply_text}`;
    request.post(url+query);
    let command = {
      key: reply_text,
      text: text
    };
    bind(command);
    ctx.reply('Bound');
  }
});

module.exports.setBot = setBot;
module.exports.setCommands = setCommands;
module.exports.setBindings = setBindings;