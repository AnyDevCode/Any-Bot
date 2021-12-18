const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = class WarnPurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warnpurge',
      aliases: ['purgewarn'],
      usage: 'warnpurge <user mention/ID> <message count> [reason]',
      description: 'Warns a member in your server and then purges their messages from the message count provided.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS', 'MANAGE_MESSAGES'],
      userPermissions: ['KICK_MEMBERS', 'MANAGE_MESSAGES'],
      examples: ['warnpurge @MDC 50']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) 
      return this.sendErrorMessage(message, 0, 'Please mention a user or provide a valid user ID');
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'You cannot warn yourself'); 
    if (member.roles.highest.position >= message.member.roles.highest.position) 
      return this.sendErrorMessage(message, 0, 'You cannot warn someone with an equal or higher role');
    
    const autoKick = message.client.db.settings.selectAutoKick.pluck().get(message.guild.id); // Get warn # for auto kick

    const amount = parseInt(args[1]);
    if (isNaN(amount) === true || !amount || amount < 0 || amount > 100)
      return this.sendErrorMessage(message, 0, 'Please provide a message count between 1 and 100');

    let reason = args.slice(2).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    const totalwarns = parseInt(message.client.db.warns.maxWarnId.pluck().get() + 1) || 1;
    const warnscount = parseInt(message.client.db.warns.selectUserWarnsCount.pluck().get(member.id, message.guild.id) + 1) || 1;
    const time = moment().format('MMM DD YYYY')

    // Warn
    message.client.db.warns.createWarn.run(member.id, member.user.username, member.user.discriminator, message.guild.id, message.guild.name, message.member.id, message.member.user.username, message.member.user.discriminator, reason, time, totalwarns);

    // Purge
    const messages = (await message.channel.messages.fetch({ limit: amount })).filter(m => m.member.id === member.id);
    if (messages.size > 0) await message.channel.bulkDelete(messages, true);  

    const embed = new MessageEmbed()
      .setTitle('Warnpurge Member')
      .setDescription(`${member} has been warned, with **${messages.size}** messages purged.`)
      .addField('Moderator', message.member, true)
      .addField('Member', member, true)
      .addField('Warn Count', `\`${warnscount}\``, true)
      .addField('Found Messages', `\`${messages.size}\``, true)
      .addField('Reason', reason)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} warnpurged ${member.user.tag}`);
    
    // Update mod log
    this.sendModLogMessage(message, reason, { 
      Member: member, 
      'Warn Count': `\`${warnscount}\``,
      'Found Messages': `\`${messages.size}\``
    });

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
