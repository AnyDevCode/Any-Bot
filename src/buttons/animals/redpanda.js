const Button = require("../Button.js");
const axios = require("axios");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");

module.exports = class RedPandaButton extends Button {
  constructor(client) {
    super(client, {
      name: "redpanda",
    });
  }

  async run(interaction) {
    const res = await axios
      .get('https://some-random-api.ml/img/red_panda')
      .then((res) => res.data)
      .catch((err) => {
        interaction.message.client.logger.error(err.stack);
        return this.sendErrorMessage(interaction.message, 1, "Please try again in a few seconds", "The API is down");
      });
    const img = res.url;
    const embed = new MessageEmbed()
      .setTitle('🐼  Auuu! 🐼')
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

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setLabel("Another red panda")
        .setStyle("PRIMARY")
        .setEmoji("🐼")
        .setCustomId("redpanda")
      )

    interaction.update({
      embeds: [embed],
      components: [row]
    });
  }
};
