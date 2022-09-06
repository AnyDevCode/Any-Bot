const Command = require("../Command.js");
const axios = require("axios");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");

module.exports = class KoalaFactCommand extends Command {
  constructor(client) {
    super(client, {
      name: "koalafact",
      aliases: ["koalafacts"],
      usage: "koalafact",
      description: "Says a random koala fact.",
      type: client.types.ANIMALS,
    });
  }
  async run(message) {
    const res = await axios
      .get("https://api.any-bot.xyz/api/v1/koala")
      .then((res) => res.data)
      .catch((err) => {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
      });
    const fact = res.fact;
    const embed = new MessageEmbed()
      .setTitle('🐨  Oooo! 🐨')
      .setDescription(fact)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({
          dynamic: true
        }),
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setLabel("Another koala fact")
        .setStyle("PRIMARY")
        .setEmoji("🐨")
        .setCustomId("koala-fact")
      )

    message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
};
