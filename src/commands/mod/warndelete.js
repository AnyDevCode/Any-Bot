const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
require('moment');

module.exports = class WarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warndelete',
      aliases: ['delwarn', 'deletewarn', 'removewarn'],
      usage: 'warndelete <Warn ID> [reason]',
      description: 'Delete a specific warn of a user.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS', 'MANAGE_MESSAGES'],
      userPermissions: ['KICK_MEMBERS', 'MANAGE_MESSAGES'],
      examples: ['warndelete 123 Erronious behaviour', 'warndelete 123'],
    });
  }
  run(message, args) {


    const warnsdb = message.client.db.warns

    const warn = {
      "id": warnsdb.selectUserIDWarn.pluck().get(parseInt(args[0])),
      "username": warnsdb.selectUsernameWarn.pluck().get(parseInt(args[0])) || '`None`',
      "discriminator": warnsdb.selectDiscriminatorWarn.pluck().get(parseInt(args[0])) || '`None`',
      "moderator_id": warnsdb.selectModeratorIDWarn.pluck().get(parseInt(args[0])) || '`None`',
      "moderator_username": warnsdb.selectModeratorUsernameWarn.pluck().get(parseInt(args[0])) || '`None`',
      "moderator_discriminator": warnsdb.selectModeratorDiscriminatorWarn.pluck().get(parseInt(args[0])) || '`None`',
      "reason": warnsdb.selectReasonWarn.pluck().get(parseInt(args[0])) || '`None`',
      "date": warnsdb.selectDateWarn.pluck().get(parseInt(args[0])) || '`None`',
    }

    const member = message.guild.members.cache.get(warn.id)

    if (!warn.id) 
      return this.sendErrorMessage(message, 0, 'Please provide a valid warn ID.');
    if (warn.id === message.member.id) 
      return this.sendErrorMessage(message, 0, 'You cannot delete a warn from yourself');
    if (member.roles.highest.position >= message.member.roles.highest.position) 
      return this.sendErrorMessage(message, 0, 'You cannot delete a warn from someone with an equal or higher role');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`None`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    const warnscount = parseInt(message.client.db.warns.selectUserWarnsCount.pluck().get(member.id, message.guild.id) - 1);

    message.client.db.warns.deleteWarn.run(parseInt(args[0]));

    const embed = new MessageEmbed()
      .setTitle('Delete Warn Member')
      .setDescription(`${member} has had a warn deleted.`)
      .addField('Moderator', message.member, true)
      .addField('Member', member, true)
      .addField('Warn Count', `\`${warnscount}\``, true)
      .addField('Reason', reason)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} unwarned ${member.user.tag}`);
    
    // Update mod log
    this.sendModLogMessage(message, reason, { Member: member, 'Warn Count': `\`${warnscount}\`` });
  }
};
