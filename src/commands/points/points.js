const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class PointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'points',
      aliases: ['p'],
      usage: 'points <user mention/ID>',
      description: 'Fetches a user\'s  points. If no user is given, your own points will be displayed.',
      type: client.types.POINTS,
      examples: ['points @MDC']
    });
  }
  async run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const points = await message.client.mongodb.users.selectPoints(member.id, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle(`${member.displayName}'s Points`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addField('Member', `${message.member}`, true)
      .addField('Points', `\`${points}\``, true)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp()
      .setColor(member.displayHexColor);
    message.channel.send({embeds: [embed]});
  }
};
