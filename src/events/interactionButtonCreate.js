const fetch = require("node-fetch");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const wait = require("util").promisify(setTimeout);
module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isButton()) return;

    await wait(400);

    if (interaction.customId === "bird") {
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
        .setColor(interaction.guild.me.displayHexColor);

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel("Another bird")
          .setStyle("PRIMARY")
          .setEmoji("🐦")
          .setCustomId("bird")
      );

      interaction.update({ embeds: [embed], components: [row] });
    } else if (interaction.customId === "bird-fact") {
      const { birdfact } = require("discord-utilities-js");

      const fact = await birdfact();
      if (typeof fact === "undefined")
        return this.sendErrorMessage(
          message,
          1,
          "Please try again in a few seconds",
          "The Api is down"
        );
      const embed = new MessageEmbed()
        .setTitle("🐦  Bird Fact!  🐦")
        .setDescription(fact)
        .setFooter({
          text: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp()
        .setColor(interaction.guild.me.displayHexColor);

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel("Another bird fact")
          .setStyle("PRIMARY")
          .setEmoji("🐦")
          .setCustomId("bird-fact")
      );

      interaction.update({ embeds: [embed], components: [row] });
    }
  },
};
