const Command = require("../Command.js");
const { MessageEmbed,
  MessageActionRow,
  MessageButton } = require("discord.js");
const axios = require("axios");

module.exports = class PandaCommand extends Command {
  constructor(client) {
    super(client, {
      name: "panda",
      usage: "panda",
      description: "Finds a random panda for your viewing pleasure.",
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
    const image = res.image;
    const embed = new MessageEmbed()
      .setTitle('🐼  Auuu! 🐼')
      .setImage(image)
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
        .setLabel("Another panda")
        .setStyle("PRIMARY")
        .setEmoji("🐼")
        .setCustomId("panda")
      )

    message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
};
