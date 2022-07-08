const { SlashCommandBuilder } = require("@discordjs/builders");
const Slash = require("../Slash.js");
const { MessageEmbed } = require("discord.js");
const { pong } = require(__basedir + "/src/utils/emojis.json");

module.exports = class EchoSlash extends Slash {
  constructor(client) {
    super(client, {
      name: "ping",
      data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),
    });
  }

  async run(interaction) {
    const time = Date.now();
    await interaction.deferReply({
      ephemeral: true,
    });
    const latency = `\`\`\`ini\n[ ${Math.floor(Date.now() - time)}ms ]\`\`\``;
    const apiLatency = `\`\`\`ini\n[ ${Math.round(
      interaction.client.ws.ping
    )}ms ]\`\`\``;
    const embed = new MessageEmbed()
      .setTitle(`Pong!  ${pong}`)
      .setDescription("")
      .addField("Latency", latency, true)
      .addField("API Latency", apiLatency, true)
      .setFooter({
        text: interaction.member.displayName,
        iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();
    interaction.editReply({
      embeds: [embed],
    });
  }
};
