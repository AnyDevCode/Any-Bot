const Button = require("../Button.js");
const axios = require("axios");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");

module.exports = class DogFactButton extends Button {
  constructor(client) {
    super(client, {
      name: "dog-fact",
    });
  }

  async run(interaction) {
    const res = await axios
      .get('https://api.any-bot.tech/api/v1/dog')
      .then((res) => res.data)
      .catch((err) => {
        interaction.message.client.logger.error(err.stack);
        return this.sendErrorMessage(interaction.message, 1, "Please try again in a few seconds", "The API is down");
      });
    const fact = res.fact;
    const embed = new MessageEmbed()
      .setTitle('🐶  Woof!  🐶')
      .setDescription(fact)
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
      .setLabel("Another dog fact")
      .setStyle("PRIMARY")
      .setEmoji("🐶")
      .setCustomId("dog-fact")
    );

    interaction.update({
      embeds: [embed],
      components: [row]
    });
  }
};
