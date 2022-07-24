const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetCrownChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownchannel',
      aliases: ['setcc', 'scc'],
      usage: 'setcrownchannel <channel mention/ID>',
      description: oneLine`
        Sets the crown message text channel for your server. 
        Provide no channel to clear the current \`crown channel\`.
        A \`crown message\` will only be sent if a \`crown channel\`, \`crown role\`, and \`crown schedule\` are set.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setcrownchannel #general']
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

    const crownRole = message.guild.roles.cache.get(crownRoleId);
    const oldCrownChannel = message.guild.channels.cache.get(crownChannelId) || '`None`';

    // Get status
    const status = message.client.utils.getStatus(crownRoleId, crownSchedule);
    
    // Trim message
    if (crownMessage && crownMessage.length > 1024) crownMessage = crownMessage.slice(0, 1021) + '...';

    const embed = new MessageEmbed()
      .setTitle('Settings: `Crown`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`crown role\` was successfully updated. ${success}`)
      .addField('Role', crownRole ? `<@&${crownRole.id}>` : '`None`', true)
      .addField('Schedule', `\`${(crownSchedule) ? crownSchedule : 'None'}\``, true)
      .addField('Status', `\`${status}\``)
      .addField('Message', message.client.utils.replaceCrownKeywords(crownMessage) || '`None`')
      .setFooter({text:message.member.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })})
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear channel
    if (args.length === 0) {
      await message.client.mongodb.settings.updateCrownChannelId(null, message.guild.id);
      return message.channel.send(embed.spliceFields(1, 0, { 
        name: 'Channel', 
        value: `${oldCrownChannel} ➔ \`None\``, 
        inline: true
      }));
    }

    const crownChannel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!crownChannel || (crownChannel.type !== 'GUILD_TEXT' && crownChannel.type !== 'GUILD_NEWS') || !crownChannel.viewable)
      return this.sendErrorMessage(message, 0, stripIndent`
        Please mention an accessible text or announcement channel or provide a valid text or announcement channel ID
      `);

    await message.client.mongodb.settings.updateCrownChannelId(crownChannel.id, message.guild.id);
    message.channel.send({embeds: [embed.spliceFields(1, 0, { 
      name: 'Channel', 
      value: `${oldCrownChannel} ➔ ${crownChannel}`, 
      inline: true 
    })]});
  }
};
