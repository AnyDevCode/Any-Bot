const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { bearfact } = require('discord-utilities-js')

module.exports = class BearFactCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'bearfact',
      aliases: ['bearfacts'],
      usage: 'bearfact',
      description: 'Says a random bear fact.',
      type: client.types.ANIMALS
    });
  }
  async run(message) {
    try {
      const fact = await bearfact()
      if(typeof fact === 'undefined') return this.sendErrorMessage(message, 1, 'Please try again in a few seconds', 'The Api is down');
      const embed = new MessageEmbed()
        .setTitle('🐻  Woof!  🐻')
        .setDescription(fact)
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })  
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send({embeds: [embed]});
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 1, 'Please try again in a few seconds', 'The Api is down');
    }
  }
};
