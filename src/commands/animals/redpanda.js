const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
const { redpanda } = require("discord-utilities-js");

module.exports = class RedPandaCommand extends Command {
  constructor(client) {
    super(client, {
      name: "redpanda",
      usage: "redpanda",
      description: "Finds a random red panda for your viewing pleasure.",
      type: client.types.ANIMALS,
    });
  }
  async run(message) {
    try {
      const img = await redpanda();
      const embed = new MessageEmbed()
        .setTitle("🐼  Woof!  🐼")
        .setImage(img)
        .setFooter(
          message.member.displayName,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(
        message,
        1,
        "Please try again in a few seconds",
        err.message
      );
    }
  }
};
