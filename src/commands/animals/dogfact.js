const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class DogFactCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'dogfact',
      aliases: ['df'],
      usage: 'dogfact',
      description: 'Says a random dog fact.',
      type: client.types.ANIMALS
    });
  }
  async run(message) {
    try {
      const res = await fetch('https://dog-api.kinduff.com/api/facts');
      const fact = (await res.json()).facts[0];
      const embed = new MessageEmbed()
        .setTitle('🐶  Dog Fact  🐶')
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
      await this.sendErrorMessage(message, 1, 'Please try again in a few seconds', "The Api is down");
    }
  }
};
