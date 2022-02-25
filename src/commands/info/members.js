const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../utils/emojis.json');
const { stripIndent } = require('common-tags');

module.exports = class MembersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'members',
      aliases: ['memberstatus'],
      usage: 'members',
      description: 'Displays how many server members are online, busy, AFK, and offline.',
      type: client.types.INFO
    });
  }
  run(message) {
    const members = Array.from(message.guild.members.cache.values());
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
    const embed = new MessageEmbed()
      .setTitle(`Member Status [${message.guild.members.cache.size}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(stripIndent`
        ${emojis.online} **Online:** \`${online}\` members
        ${emojis.dnd} **Busy:** \`${dnd}\` members
        ${emojis.idle} **AFK:** \`${afk}\` members
        ${emojis.offline} **Offline:** \`${offline}\` members
      `)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({embeds:[embed]});
  }
};