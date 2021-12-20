const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
const { foxfact } = require("discord-utilities-js");

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
    try {
      const fact = await foxfact();
      const embed = new MessageEmbed()
        .setTitle("🦊  Fox Fact!  🦊")
        .setDescription(fact)
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
