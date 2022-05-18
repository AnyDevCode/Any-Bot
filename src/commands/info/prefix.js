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
  async run(message) {
    const prefix = await message.client.mongodb.settings.selectPrefix(message.guild.id);    
    const embed = new MessageEmbed()
      .setTitle('Any Bot\'s Prefix')
      .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))
      .addField('Prefix', `\`${prefix}\``, true)
      .addField('Example', `\`${prefix}ping\``, true)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({embeds:[embed]});
  }
};
