const Command = require('../Command.js');
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require('discord.js');
const axios = require("axios");

module.exports = class BirdCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'bird',
      usage: 'bird',
      description: 'Finds a random bird for your viewing pleasure.',
      type: client.types.ANIMALS
    });
  }
  async run(message) {
      const res = await axios
        .get('https://api.any-bot.tech/api/v1/bird')
        .then((res) => res.data)
        .catch((err) => {
          message.client.logger.error(err.stack);
          return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
        });
      const img = res.image;
      const embed = new MessageEmbed()
        .setTitle('🐦  Chirp!  🐦')
        .setImage(img)
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
          .setLabel("Another bird")
          .setStyle("PRIMARY")
          .setEmoji("🐦")
          .setCustomId("bird"),
        )

      message.channel.send({
        embeds: [embed],
        components: [row]
      })
  }
};
