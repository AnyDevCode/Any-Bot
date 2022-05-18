const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class BlastCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'blast',
      usage: 'blast <message>',
      description: 'Sends a message to every server that Any Bot is in that has a system channel.',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['blast Hello World!']
    });
  }
  async run(message, args) {
    if (!args[0]) return await this.sendErrorMessage(message, 0, 'Please provide a message to blast');
    const msg = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    const guilds = [];
    message.client.guilds.cache.forEach(async guild => {
      const systemChannelId = await message.client.mongodb.settings.selectSystemChannelId(guild.id);
      const systemChannel = guild.channels.cache.get(systemChannelId);
      if (
        systemChannel && 
        systemChannel.viewable &&
        systemChannel.permissionsFor(guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
      ) {
        const embed = new MessageEmbed()
          .setTitle(`${message.client.user.username} System Message`)
          .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))
          .setDescription(msg)
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
        systemChannel.send({embeds:[embed]});
      } else guilds.push(guild.name);
    });
  
    if (guilds.length > 0) {
      // Trim array
      const description = message.client.utils.trimStringFromArray(guilds);

      const embed = new MessageEmbed()
        .setTitle('Blast Failures')
        .setDescription(description)
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send({embeds:[embed]});
    }
  } 
};