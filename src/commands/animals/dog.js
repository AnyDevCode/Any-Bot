const Command = require('../Command.js');
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require('discord.js');
const axios = require('axios');

module.exports = class DogCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'dog',
      aliases: ['puppy', 'pup'],
      usage: 'dog',
      description: 'Finds a random dog for your viewing pleasure.',
      type: client.types.ANIMALS
    });
  }
  async run(message) {
    const res = await axios
      .get("https://api.any-bot.tech/api/v1/dog")
      .then((res) => res.data)
      .catch((err) => {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
      });
    const img = res.image;
    const embed = new MessageEmbed()
      .setTitle('🐶  Woof!  🐶')
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
        .setLabel("Another dog")
        .setStyle("PRIMARY")
        .setEmoji("🐶")
        .setCustomId("dog")
      )

    message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
}