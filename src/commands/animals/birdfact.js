const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
const { birdfact } = require("discord-utilities-js");

module.exports = class BirdFactCommand extends Command {
  constructor(client) {
    super(client, {
      name: "birdfact",
      aliases: ["birdfacts"],
      usage: "birdfact",
      description: "Says a random bird fact.",
      type: client.types.ANIMALS,
    });
  }
  async run(message) {
    try {
      const fact = await birdfact();
      const embed = new MessageEmbed()
        .setTitle("🐦  Bird Fact!  🐦")
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
