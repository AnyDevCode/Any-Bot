const Button = require("../Button.js");
const axios = require("axios");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");

module.exports = class DuckButton extends Button {
  constructor(client) {
    super(client, {
      name: "duck",
    });
  }

  async run(interaction) {
    const res = await axios
      .get('https://random-d.uk/api/v2/random')
      .then((res) => res.data)
      .catch((err) => {
        interaction.message.client.logger.error(err.stack);
        return this.sendErrorMessage(interaction.message, 1, "Please try again in a few seconds", "The API is down");
      });
    const img = res.url;
    const embed = new MessageEmbed()
      .setTitle('🦆  Quack!  🦆')
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
      .setLabel("Another duck")
      .setStyle("PRIMARY")
      .setEmoji("🦆")
      .setCustomId("duck")
    );

    interaction.update({
      embeds: [embed],
      components: [row]
    });
  }
};
