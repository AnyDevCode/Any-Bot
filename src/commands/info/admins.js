const Command = require('../Command.js');
const ReactionMenu = require('../ReactionMenu.js');
const { MessageEmbed } = require('discord.js');

module.exports = class AdminsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'admins',
      usage: 'admins',
      description: 'Displays a list of all current admins.',
      type: client.types.INFO,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS']
    });
  }
  async run(message) {
    
    // Get admin role
    const adminRoleId = await message.client.mongodb.settings.selectAdminRoleId(message.guild.id);
    const adminRole = message.guild.roles.cache.get(adminRoleId) || '`None`';

    const admins = Array.from(message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === adminRole)) return true;
    }).sort((a, b) => (a.joinedAt > b.joinedAt) ? 1 : -1).values())

    const embed = new MessageEmbed()
      .setTitle(`Admin List [${admins.length}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Admin Role', `${adminRole}`)
      .addField('Admin Count', `**${admins.length}** out of **${message.guild.members.cache.size}** members`)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    const interval = 25;
    if (admins.length === 0) message.channel.send(embed.setDescription('No admins found.'));
    else if (admins.length <= interval) {
      const range = (admins.length === 1) ? '[1]' : `[1 - ${admins.length}]`;
      message.channel.send({embeds:[embed
        .setTitle(`Admin List ${range}`)
        .setDescription(admins.join('\n'))
      ]});

    // Reaction Menu
    } else {

      embed
        .setTitle('Admin List')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter({
          text: 'Expires after two minutes.\n' + message.member.displayName,  
          iconURL: message.author.displayAvatarURL({ dynamic: true })
        })

      new ReactionMenu(message.client, message.channel, message.member, embed, admins, interval);
    }
  }
};