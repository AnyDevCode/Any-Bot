const Command = require('../Command.js')
const { MessageEmbed } = require('discord.js')
const { koala } = require('discord-utilities-js')

module.exports = class KoalaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'koala',
      usage: 'koala',
      description: 'Finds a random koala for your viewing pleasure.',
      type: client.types.ANIMALS,
    })
  }
  async run(message) {
    try {
      const img = await koala()
      if (typeof img === 'undefined')
        return this.sendErrorMessage(
          message,
          1,
          'Please try again in a few seconds',
          'The Api is down',
        )
      const embed = new MessageEmbed()
        .setTitle('🐨  Woof!  🐨')
        .setImage(img)
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor)
      message.channel.send({ embeds: [embed] })
    } catch (err) {
      message.client.logger.error(err.stack)
      await this.sendErrorMessage(
        message,
        1,
        'Please try again in a few seconds',
        'The Api is down',
      )
    }
  }
}
