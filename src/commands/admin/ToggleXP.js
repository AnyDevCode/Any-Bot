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
  run(message) {
    let {
      xp_tracking: xpTracking, message_xp: xpMessages, command_xp: xpCommands, voice_xp: xpVoice
    } = message.client.db.settings.selectXP.get(message.guild.id);
    xpTracking = 1 - xpTracking; // Invert
    message.client.db.settings.updateXPTracking.run(xpTracking, message.guild.id);

    let description, status;
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
        .setDescription(`The \`message XP\` value was successfully updated. ${success}`)
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