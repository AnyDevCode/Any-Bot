const Command = require('../Command.js');
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require('discord.js');
const axios = require('axios');
module.exports = class CatCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'cat',
      aliases: ['kitten', 'kitty'],
      usage: 'cat',
      description: 'Finds a random cat for your viewing pleasure.',
      type: client.types.ANIMALS
    });
  }
  async run(message) {
    const res = await axios
      .get("https://api.any-bot.xyz/api/v1/cat")
      .then((res) => res.data)
      .catch((err) => {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
      });
    const img = res.image;
    const embed = new MessageEmbed()
      .setTitle('🐱  Meow!  🐱')
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
        .setLabel("Another cat")
        .setStyle("PRIMARY")
        .setEmoji("🐱")
        .setCustomId("cat")
      )

    message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
};
