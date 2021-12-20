const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { koala } = require('discord-utilities-js')

module.exports = class KoalaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'koala',
      usage: 'koala',
      description: 'Finds a random koala for your viewing pleasure.',
      type: client.types.ANIMALS
    });
  }
  async run(message) {
    try {
      const img = await koala()
      const embed = new MessageEmbed()
        .setTitle('🐨  Woof!  🐨')
        .setImage(img)
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
