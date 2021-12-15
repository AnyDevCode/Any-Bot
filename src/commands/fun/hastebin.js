const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const paste = require('hastebin-paste');

module.exports = class HasteBinCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'hastebin',
      usage: 'hastebin <extension> <text>',
      description: 'Save your text on the HasteBin page.',
      type: client.types.FUN
    });
  }
  async run(message, args) {

    let extensions = ["js", "json", "txt", "py", "md"]

    if (!args[0]) return message.channel.send("You should put the extension like these:\n`"+extensions.join(', ')+"`")

    if (!extensions.includes(args[0].toLowerCase())) return message.channel.send("Extension not valid")

    let content = args.slice(1).join(" ")
    
    if (!content) return message.channel.send("Write your text to paste in the hastebin")

    paste(content, { extension: args[0], message: "" }).then(hastebin => {
      message.channel.send("Url is: "+hastebin+"")

    }).catch(e => {
       message.channel.send("error:" + e)
    })



  }
};
