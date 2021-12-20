const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
const { panda } = require("discord-utilities-js");

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
    try {
      const img = await panda();
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
