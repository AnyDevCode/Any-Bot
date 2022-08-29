const Command = require("../Command.js");
const axios = require("axios");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");

module.exports = class PandaFactCommand extends Command {
  constructor(client) {
    super(client, {
      name: "pandafact",
      aliases: ["pandafacts"],
      usage: "pandafact",
      description: "Says a random panda fact.",
      type: client.types.ANIMALS,
    });
  }
  async run(message) {
    const res = await axios
      .get("https://some-random-api.ml/animal/panda")
      .then((res) => res.data)
      .catch((err) => {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
      });
    const fact = res.fact;
    const embed = new MessageEmbed()
      .setTitle('🐼  Auuu! 🐼')
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
        .setLabel("Another panda fact")
        .setStyle("PRIMARY")
        .setEmoji("🐼")
        .setCustomId("panda-fact")
      )

    message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
};
