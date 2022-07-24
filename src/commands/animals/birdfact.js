const Command = require("../Command.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
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
      if (typeof fact === "undefined") return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The Api is down");
      const embed = new MessageEmbed()
        .setTitle("🐦  Bird Fact!  🐦")
        .setDescription(fact)
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })    
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);

        const row = new MessageActionRow()
            .addComponents(
              new MessageButton()
              .setLabel("Another bird fact")
              .setStyle("PRIMARY")
              .setEmoji("🐦")
              .setCustomId("bird-fact")
            )

        
      message.channel.send({embeds: [embed], components: [row]});
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
