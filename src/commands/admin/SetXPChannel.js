const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success, verify } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetXPChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setxpchannel',
      aliases: ['setxpc', 'sxpc'],
      usage: 'setxpchannel <channel mention/ID>',
      description: oneLine`
        Sets the xp text channel for your server. 
        All level up messages will be sent there.
      `,
      type: client.types.ADMIN,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setxpchannel #levels']
    });
  }
  async run(message, args) {

    let {
      xp_channel_id: xpChannelID,
      xp_message_action: xp_message_action
    } = message.client.db.settings.selectXP.get(message.guild.id);
    const oldXPChannel = message.guild.channels.cache.get(xpChannelID) || '`None`';

    // Get status
    const oldStatus = message.client.utils.getStatus(
        xp_message_action
    );
    
    const embed = new MessageEmbed()
      .setTitle('Settings: `XP`')
      .setDescription(`The \`xp channel\` was successfully updated. ${success}`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateVerificationChannelId.run(null, message.guild.id);
      message.client.db.settings.updateVerificationMessageId.run(null, message.guild.id);

      // Update status

      return message.channel.send(embed
        .spliceFields(1, 0, { name: 'Channel', value: `${oldXPChannel} ➔ \`None\``, inline: true })
        .spliceFields(2, 0, { name: 'Status', value: statusUpdate, inline: true })
      );
    }

    const xpChannel =
      this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!xpChannel || xpChannel.type != 'text' || !xpChannel.viewable)
      return this.sendErrorMessage(message, 0, stripIndent`
        Please mention an accessible text channel or provide a valid text channel ID
      `);

    // Update status
    const status =  message.client.utils.getStatus(xpChannel);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.client.db.settings.updateXPChannelId.run(xpChannel.id, message.guild.id);
    message.channel.send(embed
      .spliceFields(1, 0, { 
        name: 'Channel', 
        value: `${oldXPChannel} ➔ ${xpChannel}`,
        inline: true
      })
      .spliceFields(2, 0, { name: 'Status', value: `\`${oldStatus}\``, inline: true})
    );
  }
};
