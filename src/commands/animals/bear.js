const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
const { bear } = require("discord-utilities-js");

module.exports = class BearCommand extends Command {
  constructor(client) {
    super(client, {
      name: "bear",
      usage: "bear",
      description: "Finds a random bear for your viewing pleasure.",
      type: client.types.ANIMALS,
      disabled: true,
    });
  }
  async run(message) {
    try {
      const img = await bear();
      if (typeof img === "undefined")
        return await this.sendErrorMessage(
          message,
          1,
          "Please try again in a few seconds",
          "The Api is down"
        );
      const embed = new MessageEmbed()
        .setTitle("🐻  Woof!  🐻")
        .setImage(img)
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send({ embeds: [embed] });
    } catch (err) {
      message.client.logger.error(err.stack);
      await this.sendErrorMessage(
        message,
        1,
        "Please try again in a few seconds",
        "The Api is down"
      );
    }
  }
};
