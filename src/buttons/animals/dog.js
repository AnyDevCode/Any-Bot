const Button = require("../Button.js");
const fetch = require("node-fetch");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = class DogButton extends Button {
  constructor(client) {
    super(client, {
      name: "dog",
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

    interaction.update({ embeds: [embed], components: [row] });
  }
};
