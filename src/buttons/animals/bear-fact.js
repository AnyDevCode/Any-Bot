const Button = require("../Button.js");
const axios = require("axios");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = class BearFactButton extends Button {
  constructor(client) {
    super(client, {
      name: "bear-fact",
    });
  }

  async run(interaction) {
    const res = await axios
        .get("https://api.any-bot.xyz/api/v1/bear")
        .then((res) => res.data)
        .catch((err) => {
          message.client.logger.error(err.stack);
          return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
        });
    const fact = res.fact;
    const embed = new MessageEmbed()
      .setTitle("🐻  Grrr!  🐻")
      .setDescription(fact)
      .setFooter({
        text: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor(
        interaction.guild ? interaction.guild.me.displayHexColor : "#7289DA"
      );

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("Another bear fact")
        .setStyle("PRIMARY")
        .setEmoji("🐻")
        .setCustomId("bear-fact")
    );

    interaction.update({ embeds: [embed], components: [row] });
  }
};
