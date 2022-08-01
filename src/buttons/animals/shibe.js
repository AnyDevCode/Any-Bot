const Button = require("../Button.js");
const axios = require("axios");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");

module.exports = class ShibeButton extends Button {
  constructor(client) {
    super(client, {
      name: "shibe",
    });
  }

  async run(interaction) {
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
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({
          dynamic: true
        }),
      })
      .setTimestamp()
      .setColor(
        interaction.guild ? interaction.guild.me.displayHexColor : "#7289DA"
      );

    const row = new MessageActionRow().addComponents(
      new MessageButton()
      .setLabel("Another shibe")
      .setStyle("PRIMARY")
      .setEmoji("🐶")
      .setCustomId("shibe")
    );

    interaction.update({
      embeds: [embed],
      components: [row]
    });
  }
};
