const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { owner, voice } = require('../../utils/emojis.json');
const { stripIndent } = require('common-tags');
const verificationLevels = {
  NONE: '`None`',
  LOW: '`Low`',
  MEDIUM: '`Medium`',
  HIGH: '`High`',
  VERY_HIGH: '`Highest`'
};
const notifications = {
  "ALL": '`All`',
  "ONLY_MENTIONS": '`Mentions`'
};

module.exports = class ServerInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      aliases: ['server', 'si'],
      usage: 'serverinfo',
      description: 'Fetches information and statistics about the server.',
      type: client.types.INFO
    });
  }
  run(message) {

    // Get roles count
    const roleCount = message.guild.roles.cache.size - 1; // Don't count @everyone

    // Get member stats
    const members = Array.from(message.guild.members.cache.values());
    const memberCount = members.length;
    const online = members.filter((m) => {
      if(m.presence) return m.presence.status === 'online';
      else return false;
    }).length;
    const offline =  members.filter((m) => m.presence === null).length;
    const dnd =  members.filter((m) => {
      if(m.presence) return m.presence.status === 'dnd';
      else return false;
    }).length;
    const afk =  members.filter((m) => {
      if(m.presence) return m.presence.status === 'idle';
      else return false;
    }).length;
    const bots = members.filter(b => b.user.bot).length;

    // Get channel stats
    const channels = Array.from(message.guild.channels.cache.values());
    const channelCount = channels.length;
    const textChannels =
      channels.filter(c => c.type === 'GUILD_TEXT' && c.viewable).sort((a, b) => a.rawPosition - b.rawPosition);
    const voiceChannels = channels.filter(c => c.type === 'GUILD_VOICE').length;
    const newsChannels = channels.filter(c => c.type === 'GUILD_NEWS').length;
    const categoryChannels = channels.filter(c => c.type === 'GUILD_CATEGORY').length;

    const serverStats = stripIndent`
      Members  :: [ ${memberCount} ]
               :: ${online} Online
               :: ${dnd} Busy
               :: ${afk} AFK
               :: ${offline} Offline
               :: ${bots} Bots
      Channels :: [ ${channelCount} ]
               :: ${textChannels.length} Text
               :: ${voiceChannels} Voice
               :: ${newsChannels} Announcement
               :: ${categoryChannels} Category
      Roles    :: [ ${roleCount} ]
    `;

    const embed = new MessageEmbed()
      .setTitle(`${message.guild.name}'s Information`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('ID', `\`${message.guild.id}\``, true)
      .addField(`Owner ${owner}`, `<@!${message.guild.ownerId}>`, true)
      .addField('Verification Level', verificationLevels[message.guild.verificationLevel], true)
      .addField('Rules Channel',
        (message.guild.rulesChannel) ? `${message.guild.rulesChannel}` : '`None`', true
      )
      .addField('System Channel',
        (message.guild.systemChannel) ? `${message.guild.systemChannel}` : '`None`', true
      )
      .addField('AFK Channel',
        (message.guild.afkChannel) ? `${voice} ${message.guild.afkChannel.name}` : '`None`', true
      )
      .addField('AFK Timeout',
        (message.guild.afkChannel) ?
          `\`${moment.duration(message.guild.afkTimeout * 1000).asMinutes()} minutes\`` : '`None`',
        true
      )
      .addField('Default Notifications', `\`${notifications[message.guild.defaultMessageNotifications]}\``, true)
      .addField('Partnered', `\`${message.guild.partnered}\``, true)
      .addField('Verified', `\`${message.guild.verified}\``, true)
      .addField('Created On', `\`${moment(message.guild.createdAt).format('MMM DD YYYY')}\``, true)
      .addField('Server Stats', `\`\`\`asciidoc\n${serverStats}\`\`\``)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    if (message.guild.description) embed.setDescription(message.guild.description);
    if (message.guild.bannerURL) embed.setImage(message.guild.bannerURL({ dynamic: true }));
    message.channel.send({embeds:[embed]});
  }
};
