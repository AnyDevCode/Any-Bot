const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const figlet = require('figlet');

module.exports = class AsciiCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ascii',
      usage: 'ascii <text>',
      description: 'Convert the text to ascii.',
      type: client.types.FUN,
      examples: ['ascii Hello']
    });
  }
  run(message, args) {
    if (!args[0]) return message.reply("You must enter the text first")
    if (args.join(" ") > 15) message.reply("Text cannot contain more than 15 Characters")
    figlet(args.join(" "), (err, data) => message.channel.send("```" + data + "```"))
  }
};
