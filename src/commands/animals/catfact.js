const Command = require('../Command.js');
const axios = require("axios");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");

module.exports = class CatFactCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'catfact',
      aliases: ['cf'],
      usage: 'catfact',
      description: 'Says a random cat fact.',
      type: client.types.ANIMALS
    });
  }
  async run(message) {
    const res = await axios
      .get('https://api.any-bot.xyz/api/v1/cat')
      .then((res) => res.data)
      .catch((err) => {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
      });
    const fact = (await res.json()).fact;
    const embed = new MessageEmbed()
      .setTitle('🐱  Cat Fact  🐱')
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
        .setLabel("Another cat fact")
        .setStyle("PRIMARY")
        .setEmoji("🐱")
        .setCustomId("cat-fact"),
      )
      
    message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
};
