const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class PrefixCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'prefix',
      aliases: ['pre'],
      usage: 'prefix',
      description: 'Fetches Any Bot\'s current prefix.',
      type: client.types.INFO
    });
  }
  run(message) {
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    const embed = new MessageEmbed()
      .setTitle('Any Bot\'s Prefix')
      .setThumbnail('https://cdn.glitch.com/5bfb504c-974f-4460-ab6e-066acc7e4fa6%2Fezgif.com-gif-to-apng.png?v=1595260265531')
      .addField('Prefix', `\`${prefix}\``, true)
      .addField('Example', `\`${prefix}ping\``, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
