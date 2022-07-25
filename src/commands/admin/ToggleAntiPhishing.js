const Command = require('../Command.js');
const {
  MessageEmbed
} = require('discord.js');
const {
  success,
  fail
} = require('../../utils/emojis.json');
const {
  oneLine
} = require('common-tags');

module.exports = class ToggleAntiPhishingCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'toggleantiphishing',
      aliases: ['toggleap'],
      description: oneLine `
        Enables or disables the anti-phishing feature.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
    });
  }
  async run(message) {
    let antiPhishing = await message.client.mongodb.settings.antiPhishing(message.guild.id)

    let embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL({
        dynamic: true
      }))
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({
          dynamic: true
        }),
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (antiPhishing) message.channel.send({
      embeds: [embed.setDescription(`The anti-phishing feature has been successfully **disabled**. ${fail}`)]
    });
    else message.channel.send({
      embeds: [embed.setDescription(`The anti-phishing feature has been successfully **enabled**. ${success}`)]
    });

    await message.client.mongodb.settings.updateAntiPhishing(message.guild.id, !antiPhishing)

  }
};
