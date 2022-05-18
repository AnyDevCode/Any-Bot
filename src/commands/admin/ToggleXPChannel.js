const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class ToggleXPChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'togglexpchannel',
      aliases: ['togglexpc', 'togxpc', 'txpc'],
      usage: 'togglexpchannel <command>',
      description: oneLine`
        Enables or disables XP channel.
        Disabled by default.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['togglexpchannel']
    });
  }
  async run(message) {

    let {
      xpMessageAction: xp_message_action
    } = await message.client.mongodb.settings.selectRow(message.guild.id);

    xp_message_action = 1 - xp_message_action

    await message.client.mongodb.settings.updateXPChannelMessage(xp_message_action, message.guild.id);

    const status = message.client.utils.getStatus(xp_message_action)

    const embed = new MessageEmbed()
        .setTitle('Settings: `XP`')
      .setDescription(`Status: \`${status}\``)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setColor(message.guild.me.displayHexColor)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })  
      .setTimestamp();

    message.channel.send({embeds: [embed]});

  }
};
