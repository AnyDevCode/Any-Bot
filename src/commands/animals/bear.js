const Command = require("../Command.js");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");
const axios = require("axios");

module.exports = class BearCommand extends Command {
  constructor(client) {
    super(client, {
      name: "bear",
      usage: "bear",
      description: "Finds a random bear for your viewing pleasure.",
      type: client.types.ANIMALS,
    });
  }
  async run(message) {
    const res = await axios
      .get("https://api.any-bot.tech/api/v1/bear")
      .then((res) => res.data)
      .catch((err) => {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
      });
    const img = res.image;
    const embed = new MessageEmbed()
      .setTitle("🐻  Grrr!  🐻")
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
        .setLabel("Another bear")
        .setStyle("PRIMARY")
        .setEmoji("🐻")
        .setCustomId("bear"),
      )

    message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
};
