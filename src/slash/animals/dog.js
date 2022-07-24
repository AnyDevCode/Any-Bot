const { SlashCommandBuilder } = require("@discordjs/builders");
const Slash = require("../Slash.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fetch = require("node-fetch");

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
    const res = await fetch("https://dog.ceo/api/breeds/image/random");
    const img = (await res.json()).message;   
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
