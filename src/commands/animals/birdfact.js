const Command = require("../Command.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const axios = require("axios");
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
    const res = await axios
    .get('https://api.any-bot.tech/api/v1/bird')
    .then((res) => res.data)
    .catch((err) => {
      message.client.logger.error(err.stack);
      return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
    });
  const fact = res.fact;
  const embed = new MessageEmbed()
    .setTitle('🐦  Chirp!  🐦')
    .setDescription(fact)
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
      .setLabel("Another bird fact")
      .setStyle("PRIMARY")
      .setEmoji("🐦")
      .setCustomId("bird-fact"),
    )

  message.channel.send({
    embeds: [embed],
    components: [row]
  })
  }
};
