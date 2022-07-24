const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success, fail } = require('../../utils/emojis.json');

module.exports = class TogglePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'togglexp',
      aliases: ['togglexp', 'togxp'],
      usage: 'togglexp',
      description: 'Enables or disables Any Bot\'s xp tracking.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD']
    });
  }
  async run(message) {
    let {
      xpTracking: xpTracking, messageXP: xpMessages, commandXP: xpCommands, voiceXP: xpVoice
    } = await message.client.mongodb.settings.selectRow(message.guild.id);
    xpTracking = 1 - xpTracking; // Invert
    await message.client.mongodb.settings.updateXPTracking(xpTracking, message.guild.id);

    let status, description;
    if (xpTracking === 1) {
      status = '`disabled`	🡪 `enabled`';
      description = `\`XP\` have been successfully **enabled**. ${success}`;
    } else {
      status = '`enabled` 🡪 `disabled`';
      description = `\`XP\` have been successfully **disabled**. ${fail}`;
    }

    let minimum_xp_command = Math.floor(xpCommands - 2);
    if (minimum_xp_command < 0) minimum_xp_command = 0;
    let maximum_xp_command = Math.floor(xpCommands + 2);

    let minimum_xp_voice = Math.floor(xpVoice - 2);
    if (minimum_xp_voice < 0) minimum_xp_voice = 0;
    let maximum_xp_voice = Math.floor(xpVoice + 2);

    let minimum_xp_message = Math.floor(xpMessages - 2);
    if (minimum_xp_message < 0) minimum_xp_message = 0;
    let maximum_xp_message = Math.floor(xpMessages + 2);
    
    const embed = new MessageEmbed()
        .setTitle('Settings: `XP`')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(description)
        .addField("Message XP", `\`Minimum: ${minimum_xp_message}\` - \`Maximum: ${maximum_xp_message}\``)
        .addField('Command XP', `\`Minimum: ${minimum_xp_command}\` - \`Maximum: ${maximum_xp_command}\``)
        .addField('Voice XP', `\`Minimum: ${minimum_xp_voice}\` - \`Maximum: ${maximum_xp_voice}\``)
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