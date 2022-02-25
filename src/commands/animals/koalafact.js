const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
const { koalafact } = require("discord-utilities-js");

module.exports = class KoalaFactCommand extends Command {
  constructor(client) {
    super(client, {
      name: "koalafact",
      aliases: ["koalafacts"],
      usage: "koalafact",
      description: "Says a random koala fact.",
      type: client.types.ANIMALS,
    });
  }
  async run(message) {
    try {
      const fact = await koalafact();
      if(typeof fact === "undefined") return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The Api is down");
      const embed = new MessageEmbed()
        .setTitle("🐨  Koala Fact!  🐨")
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
      this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The Api is down");
    }
  }
};
