const Command = require('../Command.js');
const { MessageEmbed, MessageActionRow,
  MessageButton } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class InviteMeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'inviteme',
      aliases: ['invite', 'invme', 'im'],
      usage: 'inviteme',
      description: 'Generates a link you can use to invite Any Bot to your own server.',
      type: client.types.INFO
    });
  }
  run(message) {
    const embed = new MessageEmbed()
      .setTitle('Invite Me')
      .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))
      .setDescription(oneLine`
        Click [here](https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot%20applications.commands&permissions=8)
        to invite me to your server!
      `)
      .addField('Other Links', 
      `**[Support Server](${message.client.supportServerInvite})**`
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
