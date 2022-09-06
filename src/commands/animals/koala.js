const Command = require('../Command.js')
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require('discord.js')
const axios = require('axios')

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
    const res = await axios
      .get("https://api.any-bot.xyz/api/v1/koala")
      .then((res) => res.data)
      .catch((err) => {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
      });
    const image = res.image;
    const embed = new MessageEmbed()
      .setTitle('🐨  Oooo! 🐨')
      .setImage(image)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({
          dynamic: true
        }),
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setLabel("Another koala")
        .setStyle("PRIMARY")
        .setEmoji("🐨")
        .setCustomId("koala")
      )

    message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
}
