const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class WarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warn',
      usage: 'warn <user mention/ID> [reason]',
      description: 'Warns a member in your server.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS'],
      userPermissions: ['KICK_MEMBERS'],
      examples: ['warn @MDC']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) 
      return await this.sendErrorMessage(message, 0, 'Please mention a user or provide a valid user ID');
    if (member === message.member) 
      return await this.sendErrorMessage(message, 0, 'You cannot warn yourself'); 
    if (member.roles.highest.position >= message.member.roles.highest.position) 
      return await this.sendErrorMessage(message, 0, 'You cannot warn someone with an equal or higher role');

    const autoKick = await message.client.mongodb.settings.selectAutoKick(message.guild.id); // Get warn # for auto kick
    const autoBan = await message.client.mongodb.settings.selectAutoBan(message.guild.id); // Get warn # for auto kick

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    const totalwarns = parseInt(message.client.db.warns.maxWarnId.pluck().get() + 1) || 1;

    const warnscount = parseInt(message.client.db.warns.selectUserWarnsCount.pluck().get(member.id, message.guild.id) + 1) || 1;

    const time = moment().format('MMM DD YYYY')
    message.client.db.warns.createWarn.run(member.id, member.user.username, member.user.discriminator, message.guild.id, message.guild.name, message.member.id, message.member.user.username, message.member.user.discriminator, reason, time, totalwarns);

    const embed = new MessageEmbed()
      .setTitle('Warn Member')
      .setDescription(`${member} has been warned.`)
      .addField('Moderator', `${message.member}`, true)
      .addField('Member', `${member}`, true)
      .addField('Warn Count', `\`${warnscount}\``, true)
      .addField('Reason', reason)
      .addField('Warn ID', `\`${totalwarns}\``, true)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({embeds:[embed]});
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} warned ${member.user.tag}`);
    
    // Update mod log
    this.sendModLogMessage(message, reason, { Member: member, 'Warn Count': `\`${warnscount}\`` });

    // Check for auto kick
    if (autoKick && warnscount === autoKick) {
      message.client.commands.get('kick')
        .run(message, [member.id, `Warn limit reached. Automatically kicked by ${message.guild.me}.`]);
    }

    // Check for auto ban
    if (autoBan && warnscount === autoBan) {
      message.client.commands.get('ban')
        .run(message, [member.id, `Warn limit reached. Automatically banned by ${message.guild.me}.`]);
    }
  }
};
