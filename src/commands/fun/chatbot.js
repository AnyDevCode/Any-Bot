const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class ChatBotCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'chatbot',
      aliases: ['chb', 'cbot'],
      usage: 'chatbot <message>',
      description: 'He answers what you tell him.',
      type: client.types.FUN
    });
  }
  async run(message, args) {
    if (!args[0]) return this.sendErrorMessage(message, 0, 'Put some text that you want me to answer you');
    let text = args.join(" ");
    try {
      const res = await fetch(`https://some-random-api.ml/chatbot?message=${text.replace(new RegExp(",", "g"), "%20")}`);
      const img = (await res.json()).response;
      const embed = new MessageEmbed()
        .setTitle(':robot:  Chat Bot!  :robot:')
        .setDescription(img)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 1, 'Please try again in a few seconds', err.message);
    }
  }
};
