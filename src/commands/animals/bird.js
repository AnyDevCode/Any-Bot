const Command = require('../Command.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class BirdCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'bird',
      usage: 'bird',
      description: 'Finds a random bird for your viewing pleasure.',
      type: client.types.ANIMALS
    });
  }
  async run(message) {
    try {
      const res = await fetch('https://shibe.online/api/birds');
      const img = (await res.json())[0];
      const embed = new MessageEmbed()
        .setTitle('🐦  Chirp!  🐦')
        .setImage(img)
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })          
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);

        const row = new MessageActionRow()
            .addComponents(
              new MessageButton()
              .setLabel("Another bird")
              .setStyle("PRIMARY")
              .setEmoji("🐦")
              .setCustomId("bird"),
            )

      message.channel.send({embeds: [embed], components: [row]})

    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 1, 'Please try again in a few seconds', 'The Api is down');
    }
  }
};
