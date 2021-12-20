const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
const { pandafact } = require("discord-utilities-js");

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
    try {
      const fact = await pandafact();
      const embed = new MessageEmbed()
        .setTitle("🐼  Panda Fact!  🐼")
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
