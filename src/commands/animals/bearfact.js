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
      const embed = new MessageEmbed()
        .setTitle('🐻  Woof!  🐻')
        .setDescription(fact)
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
