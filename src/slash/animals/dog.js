const { SlashCommandBuilder } = require("@discordjs/builders");
const Slash = require("../Slash.js");
const axios = require("axios");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");

module.exports = class DogSlash extends Slash {
  constructor(client) {
    super(client, {
      name: "dog",
      data: new SlashCommandBuilder()
        .setName("dog")
        .setDescription("Finds a random dog for your viewing pleasure."),
    });
  }

  async run(interaction) {
    const res = await axios
      .get("https://api.any-bot.xyz/api/v1/dog")
      .then((res) => res.data)
      .catch((err) => {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
      });
    const img = res.image;   
    const embed = new MessageEmbed()
      .setTitle("🐶  Woof!  🐶")
      .setImage(img)
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
        .setLabel("Another dog")
        .setStyle("PRIMARY")
        .setEmoji("🐶")
        .setCustomId("dog")
    );

    interaction.reply({ embeds: [embed], components: [row] });
  }
};
