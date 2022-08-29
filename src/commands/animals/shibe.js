const Command = require('../Command.js');
const axios = require("axios");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");

module.exports = class ShibeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shibe',
      usage: 'shibe',
      description: 'Finds a random shibe for your viewing pleasure.',
      type: client.types.ANIMALS
    });
  }
  async run(message) {
    const res = await axios
      .get("https://shibe.online/api/shibes")
      .then((res) => res.data)
      .catch((err) => {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
      });
    const img = res[0]
    const embed = new MessageEmbed()
      .setTitle('🐶  Woof!  🐶')
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
        .setLabel("Another shibe")
        .setStyle("PRIMARY")
        .setEmoji("🐶")
        .setCustomId("Shibe")
      )

    message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
};
