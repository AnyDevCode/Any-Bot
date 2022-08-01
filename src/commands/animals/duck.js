const Command = require('../Command.js');
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require('discord.js');
const axios = require('axios');

module.exports = class DuckCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'duck',
      usage: 'duck',
      description: 'Finds a random duck for your viewing pleasure.',
      type: client.types.ANIMALS
    });
  }
  async run(message) {
    const res = await axios.get('https://random-d.uk/api/v2/random')
      .then((res) => res.data)
      .catch((err) => {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
      });
    const img = res.url;
    const embed = new MessageEmbed()
      .setTitle('🦆  Quack!  🦆')
      .setImage(img)
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
        .setLabel("Another duck")
        .setStyle("PRIMARY")
        .setEmoji("🦆")
        .setCustomId("duck")
      )
    message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
};
