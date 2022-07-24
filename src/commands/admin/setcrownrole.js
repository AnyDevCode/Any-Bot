const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine } = require('common-tags');

module.exports = class SetCrownRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownrole',
      aliases: ['setcr', 'scr'],
      usage: 'setcrownrole <role mention/ID>',
      description: oneLine`
        Sets the role Any Bot will give to the member with the most points each cycle.
        Provide no role to clear the current \`crown role\`.
        A \`crown schedule\` must also be set to enable role rotation.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      clientPermissions: ['MANAGE_ROLES'],
      examples: ['setcrownrole @Crowned']
    });
  }
  async run(message, args) {
    let {
      crownRoleID: crownRoleId,
      crownChannelID: crownChannelId,
      crownMessage: crownMessage,
      crownSchedule: crownSchedule
    } = await message.client.mongodb.settings.selectRow(message.guild.id);

    if (crownMessage[0].data.text){
      crownMessage = crownMessage[0].data.text;
    } else {
      crownMessage = ""
    }

    const oldCrownRole = message.guild.roles.cache.get(crownRoleId) || '`None`';
    const crownChannel = message.guild.channels.cache.get(crownChannelId);

    // Get status
    const oldStatus = message.client.utils.getStatus(crownRoleId, crownSchedule);

    // Trim message
    if (crownMessage && crownMessage.length > 1024) crownMessage = crownMessage.slice(0, 1021) + '...';

    const embed = new MessageEmbed()
      .setTitle('Settings: `Crown`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`crown role\` was successfully updated. ${success}`)
      .addField('Channel', crownChannel ? `<#${crownChannel.id}>` : '`None`', true)
      .addField('Schedule', `\`${(crownSchedule) ? crownSchedule : 'None'}\``, true)
      .addField('Message', message.client.utils.replaceCrownKeywords(crownMessage) || '`None`')
      .setFooter({text:message.member.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })})
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear role
    if (args.length === 0) {
      await message.client.mongodb.settings.updateCrownRoleId(null, message.guild.id);
      if (message.guild.job) message.guild.job.cancel(); // Cancel old job

      message.client.logger.info(`${message.guild.name}: Cancelled job`);
      
      // Update status
      const status = 'disabled';
      const statusUpdate = (oldStatus !== status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

      return message.channel.send({embeds:[embed
        .spliceFields(0, 0, { name: 'Role', value: `${oldCrownRole} ➔ \`None\``, inline: true })
        .spliceFields(3, 0, { name: 'Status', value: statusUpdate })
      ]});
    }

    // Update role
    const crownRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!crownRole) return this.sendErrorMessage(message, 0, 'Please mention a role or provide a valid role ID');
    await message.client.mongodb.settings.updateCrownRoleId(crownRole.id, message.guild.id);

    // Update status
    const status =  message.client.utils.getStatus(crownRole, crownSchedule);
    const statusUpdate = (oldStatus !== status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.channel.send({embeds:[embed
      .spliceFields(0, 0, { name: 'Role', value: `${oldCrownRole} ➔ ${crownRole}`, inline: true })
      .spliceFields(3, 0, { name: 'Status', value: statusUpdate })
    ]});

    // Schedule crown role rotation
    await message.client.utils.scheduleCrown(message.client, message.guild);
  }
};
