const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success, fail } = require('../../utils/emojis.json');

module.exports = class TogglePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'togglepoints',
      aliases: ['togglep', 'togp'],
      usage: 'togglepoints',
      description: 'Enables or disables Any Bot\'s point tracking.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD']
    });
  }
  async run(message) {
    let {
      pointTracking: pointTracking,
      messagePoints: messagePoints,
      commandPoints: commandPoints,
      voicePoints: voicePoints
    } = await message.client.mongodb.settings.selectRow(message.guild.id);
    pointTracking = 1 - pointTracking; // Invert
    await message.client.mongodb.settings.updatePointTracking(pointTracking, message.guild.id);

    let description, status;
    if (pointTracking === 1) {
      status = '`disabled`	🡪 `enabled`';
      description = `\`Points\` have been successfully **enabled**. ${success}`;
    } else {
      status = '`enabled` 🡪 `disabled`';
      description = `\`Points\` have been successfully **disabled**. ${fail}`;   
    } 
    
    const embed = new MessageEmbed()
      .setTitle('Settings: `Points`')
      .setThumbnail(message.guild.iconURL())
      .setDescription(description)
      .addField('Message Points', `\`${messagePoints}\``, true)
      .addField('Command Points', `\`${commandPoints}\``, true)
      .addField('Voice Points', `\`${voicePoints}\``, true)
      .addField('Status', status)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })   
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({embeds: [embed]});
  }
};