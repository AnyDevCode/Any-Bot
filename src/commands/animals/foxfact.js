const Command = require("../Command.js");
const { MessageEmbed,
  MessageActionRow,
  MessageButton } = require("discord.js");
const axios = require("axios");

module.exports = class FoxFactCommand extends Command {
  constructor(client) {
    super(client, {
      name: "foxfact",
      aliases: ["foxfacts"],
      usage: "foxfact",
      description: "Says a random fox fact.",
      type: client.types.ANIMALS,
    });
  }
  async run(message) {
    const res = await axios
      .get("https://api.any-bot.tech/api/v1/fox")
      .then((res) => res.data)
      .catch((err) => {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
      });
    const fact = res.fact;
    const embed = new MessageEmbed()
      .setTitle('🦊  Auuu! 🦊 ')
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
        .setLabel("Another fox fact")
        .setStyle("PRIMARY")
        .setEmoji("🦊")
        .setCustomId("fox-fact")
      )

    message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
};
