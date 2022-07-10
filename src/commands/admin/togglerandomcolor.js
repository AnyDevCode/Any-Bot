const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success, fail } = require('../../utils/emojis.json');

module.exports = class ToggleRandomColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'togglerandomcolor',
      aliases: ['togglerc', 'togrc', 'trc'],
      usage: 'togglerandomcolor',
      description: 'Enables or disables random color role assigning when someone joins your server.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      clientPermissions: ['MANAGE_ROLES'],
    });
  }
  async run(message) {
    let randomColor = await message.client.mongodb.settings.selectRandomColor(message.guild.id);
    randomColor = 1 - randomColor; // Invert
    await message.client.mongodb.settings.updateRandomColor(randomColor, message.guild.id);
    let description, status;
    if (randomColor === 1) {
      status = '`disabled`	🡪 `enabled`';
      description = `\`Random color\` has been successfully **enabled**. ${success}`;
    } else {
      status = '`enabled` 🡪 `disabled`';
      description = `\`Random color\` has been successfully **disabled**. ${fail}`;   
    } 
    
    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL())
      .setDescription(description)
      .addField('Random Color', status, true)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })  
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({embeds: [embed]});
  }
};