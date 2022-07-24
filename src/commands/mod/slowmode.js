const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');
const ms = require('ms');

module.exports = class SlowmodeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'slowmode',
      aliases: ['slow', 'sm'],
      usage: 'slowmode [channel mention/ID] <rate> [reason]',
      description: oneLine`
        Enables slowmode in a channel with the specified rate.
        If no channel is provided, then slowmode will affect the current channel.
        Provide a rate of 0 to disable.
      `,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],
      userPermissions: ['MANAGE_CHANNELS'],
      examples: ['slowmode #general 2', 'slowmode 3']
    });
  }
  async run(message, args) {
    let index = 1;
    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!channel) {
      channel = message.channel;
      index--;
    }

    let time

    if(!args[index]) time = '0';
    else time = (ms(args[index]) / 1000).toFixed(0);

    // Check type and viewable
    if (channel.type !== 'GUILD_TEXT' || !channel.viewable) return this.sendErrorMessage(message, 0, stripIndent`
      Please mention an accessible text channel or provide a valid text channel ID
    `);
      
    const rate = args[index];
    if (!time || time < 0 || time > 21600) return this.sendErrorMessage(message, 0, stripIndent`
      Please provide a rate limit between 0 and 6 hours
    `);

    // Check channel permissions
    if (!channel.permissionsFor(message.guild.me).has(['MANAGE_CHANNELS']))
      return this.sendErrorMessage(message, 0, 'I do not have permission to manage the provided channel');

    let reason = args.slice(index + 1).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    const status = (channel.rateLimitPerUser) ? 'enabled' : 'disabled';
    await channel.setRateLimitPerUser(time, reason); // set channel rate
    const embed = new MessageEmbed()
      .setTitle('Slowmode')
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Slowmode disabled
    if (time === '0') {
      message.channel.send({embeds:[embed
        .setDescription(`\`${status}\` ➔ \`disabled\``)
        .addField('Moderator', `${message.member}`, true)
        .addField('Channel', `${channel}`, true)
        .addField('Reason', reason)
      ]});
    
      // Slowmode enabled
    } else {

      message.channel.send({embeds:[embed
        .setDescription(`\`${status}\` ➔ \`enabled\``)
        .addField('Moderator', `${message.member}`, true)
        .addField('Channel', `${channel}`, true)
        .addField('Rate', `\`${rate}\``, true)
        .addField('Reason', reason)
      ]});
    }

    // Update mod log
    await this.sendModLogMessage(message, reason, {Channel: channel, Rate: `\`${rate}\``});
  }
};
