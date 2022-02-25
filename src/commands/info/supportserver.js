const Command = require('../Command.js');
const { MessageEmbed, MessageActionRow,
  MessageButton } = require('discord.js');

module.exports = class SupportServerCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'supportserver',
      aliases: ['support', 'ss'],
      usage: 'supportserver',
      description: 'Displays the invite link to Any Bot\'s Discord Support Server.',
      type: client.types.INFO
    });
  }
  run(message) {
    const embed = new MessageEmbed()
      .setTitle('Support Server')
      .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`Click [here](${message.client.supportServerInvite}) to join the ${message.client.user.username} Support Server!`)
      .addField('Other Links', 
      `**[Invite Me](https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot%20applications.commands&permissions=8)**`
      )
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    const linkrow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setLabel('Invite Me')
          .setStyle('LINK')
          .setURL(`https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot%20applications.commands&permissions=8`)
          .setEmoji('🔗'),
        new MessageButton()
          .setLabel('Support Server')
          .setStyle('LINK')
          .setURL(message.client.supportServerInvite)
          .setEmoji('🛡')
      );
    message.channel.send({embeds:[embed], components: [linkrow]});
  }
};
