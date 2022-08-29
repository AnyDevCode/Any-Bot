const Command = require('../Command.js');
const {
  MessageEmbed
} = require('discord.js');
const {
  oneLine
} = require('common-tags');
const axios = require("axios");

module.exports = class ThouArtCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'thouart',
      aliases: ['elizabethan', 'ta'],
      usage: 'thouart [user mention/ID]',
      description: oneLine `
        Says a random Elizabethan insult to the specified user. 
        If no user is given, then the insult will be directed at you!
      `,
      type: client.types.FUN,
      examples: ['thouart @MDC']
    });
  }
  async run(message, args) {
    const member = this.getMemberFromMention(message, args[0]) ||
      message.guild.members.cache.get(args[0]) ||
      message.member;
      const res = await axios.get("https://quandyfactory.com/insult/json/")
        .then((res) => res.data)
        .catch((err) => {
          message.client.logger.error(err.stack);
          return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
        });
      let insult = res.insult;
      insult = insult.charAt(0).toLowerCase() + insult.slice(1);
      const embed = new MessageEmbed()
        .setTitle('🎭  Thou Art  🎭')
        .setDescription(`${member}, ${insult}`)
        .setFooter({
          text: message.member.displayName,
          icon_url: message.author.displayAvatarURL({
            dynamic: true
          })
        })
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send({
        embeds: [embed]
      });
  }
};
