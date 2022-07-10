const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class RandomColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'randomcolor',
      aliases: ['rc'],
      usage: 'randomcolor',
      description: 'Changes your current color to a random different one.',
      type: client.types.COLOR,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES']
    });
  }
  async run(message) {
    
    const embed = new MessageEmbed()
      .setTitle('Color Change')
      .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
      .addField('Member', `${message.member}`, true)
      .setFooter({text: message.member.displayName, icon_url: message.author.displayAvatarURL({ dynamic: true })})
      .setTimestamp();
    const colors = Array.from(message.guild.roles.cache.filter(c => c.name.startsWith('#')).values());
    if (colors.length === 0)
      return await this.sendErrorMessage(message, 1, 'There are currently no colors set on this server');
    let color = colors[Math.floor(Math.random() * colors.length)];
    const oldColor = (message.member.roles.color && message.member.roles.color.name.startsWith('#')) ? 
      message.member.roles.color : '`None`';

      function checkColor(oldcolor, newcolor) {
        if (oldcolor.name === newcolor.name) {
          color = colors[Math.floor(Math.random() * colors.length)];
          if(oldcolor.name === color.name) {
            checkColor(oldcolor, color);
          }
        }
      }

      checkColor(oldColor, color);

    try {
      await message.member.roles.remove(colors);
      await message.member.roles.add(color);
      message.channel.send({embeds:[embed.addField('Color', `${oldColor} ➔ ${color}`, true).setColor(color.hexColor)]});
    } catch (err) {
      message.client.logger.error(err.stack);
      await this.sendErrorMessage(message, 1, 'Please check the role hierarchy', err.message);
    }
  }
};
