const Button = require("../Button.js");
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const { birdfact } = require("discord-utilities-js");

module.exports = class BirdFactButton extends Button {
    constructor(client) {
    super(client, {
      name: "bird-fact"
    });
  }

  async run(interaction) {

      const fact = await birdfact();
      if (typeof fact === "undefined")
          return await this.sendErrorMessage(
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
  };
