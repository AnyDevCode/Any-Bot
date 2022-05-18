const Button = require("../Button.js");
const fetch = require("node-fetch");
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");

module.exports = class BirdButton extends Button {
    constructor(client) {
    super(client, {
      name: "bird"
    });
  }

  async run(interaction) {
      const res = await fetch("https://shibe.online/api/birds");
      const img = (await res.json())[0];
      const embed = new MessageEmbed()
          .setTitle("🐦  Chirp!  🐦")
          .setImage(img)
          .setFooter({
              text: interaction.user.username,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp()
          .setColor(interaction.guild ? interaction.guild.me.displayHexColor : '#7289DA');

      const row = new MessageActionRow().addComponents(
          new MessageButton()
              .setLabel("Another bird")
              .setStyle("PRIMARY")
              .setEmoji("🐦")
              .setCustomId("bird")
      );

      interaction.update({ embeds: [embed], components: [row] });
      }
  };
