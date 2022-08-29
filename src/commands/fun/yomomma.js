const Command = require('../Command.js');
const {
  MessageEmbed
} = require('discord.js');
const axios = require("axios");
const {
  oneLine
} = require('common-tags');

module.exports = class YoMommaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'yomomma',
      aliases: ['yourmom', 'yomamma', 'yomama', 'ym'],
      usage: 'yomomma [user mention/ID]',
      description: oneLine `
        Says a random "yo momma" joke to the specified user. 
        If no user is given, then the joke will be directed at you!
      `,
      type: client.types.FUN,
      examples: ['yomomma @MDC']
    });
  }
  async run(message, args) {
    const member = this.getMemberFromMention(message, args[0]) ||
      message.guild.members.cache.get(args[0]) ||
      message.member;
    try {
      const res = await axios.get('https://api.yomomma.info')
        .then((res) => res.data)
        .catch((err) => {
          message.client.logger.error(err.stack);
          return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
        })
      let joke = res.joke;
      joke = joke.charAt(0).toLowerCase() + joke.slice(1);
      if (!joke.endsWith('!') && !joke.endsWith('.') && !joke.endsWith('"')) joke += '!';
      const embed = new MessageEmbed()
        .setTitle('🍼  Yo Momma  🍼')
        .setDescription(`${member}, ${joke}`)
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
    } catch (err) {
      message.client.logger.error(err.stack);
      await this.sendErrorMessage(message, 1, 'Please try again in a few seconds', err.message);
    }
  }
};
