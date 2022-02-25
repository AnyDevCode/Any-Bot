const Command = require('../Command.js');
const ReactionMenu = require('../ReactionMenu.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ServersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'servers',
      aliases: ['servs'],
      usage: 'servers',
      description: 'Displays a list of Any Bot\'s joined servers.',
      type: client.types.OWNER,
      ownerOnly: true
    });
  }
  run(message) {

    const servers = Array.from(message.client.guilds.cache.values()).map(guild => {
      return `\`${guild.id}\` - **${guild.name}** - \`${guild.members.cache.size}\` members`;
    });

    const embed = new MessageEmbed()
      .setTitle('Server List')
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (servers.length <= 10) {
      const range = (servers.length == 1) ? '[1]' : `[1 - ${servers.length}]`;
      message.channel.send({embeds:[embed.setTitle(`Server List ${range}`).setDescription(servers.join('\n'))]});
    } else {
      new ReactionMenu(message.client, message.channel, message.member, embed, servers);
    }
  }
};
