const { SlashCommandBuilder } = require("@discordjs/builders");
const Slash = require("../Slash.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class BirdSlash extends Slash {
    constructor(client) {
    super(client, {
      name: "bird",
      data: new SlashCommandBuilder()
        .setName("bird")
        .setDescription("Finds a random bird for your viewing pleasure.")
    });
  }

  async run(interaction) {
    const res = await fetch('https://shibe.online/api/birds');
    const img = (await res.json())[0];
    const embed = new MessageEmbed()
        .setTitle('🐦  Chirp!  🐦')
        .setImage(img)
        .setFooter({
          text: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })          
        .setTimestamp()
        .setColor(interaction.guild.me.displayHexColor);

        const row = new MessageActionRow()
            .addComponents(
              new MessageButton()
              .setLabel("Another bird")
              .setStyle("PRIMARY")
              .setEmoji("🐦")
              .setCustomId("bird"),
            )

    interaction.reply({embeds: [embed], components: [row]});
  }
};
