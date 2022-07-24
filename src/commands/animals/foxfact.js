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
      if(typeof fact === "undefined") return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The Api is down");
      const embed = new MessageEmbed()
        .setTitle("🦊  Fox Fact!  🦊")
        .setDescription(fact)
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })  
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send({embeds: [embed]});
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
