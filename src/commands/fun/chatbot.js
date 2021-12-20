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
      const apiKey = message.client.apiKeys.somerandomapikey
      const res = await fetch(`https://some-random-api.ml/chatbot?message=${text.replace(new RegExp(",", "g"), "%20").replace("ñ", "%f1").replace("Ñ", "%d1").replace("¿","").replace("¡","").replace("?","%3F")}&key=${apiKey}`);
      const answer = (await res.json());
      const embed = new MessageEmbed()
        .setTitle(':robot:  Chat Bot!  :robot:')
        .setDescription(answer.response)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      if (answer.error) return embed.setDescription("I'm sorry, I can't answer that right now. Please try again later.");
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 1, "I'm sorry, I can't answer that right now. Please try again later.");
    }
  }
};
