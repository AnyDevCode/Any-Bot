const Command = require('../Command.js');
const {
  MessageEmbed
} = require('discord.js');
const {
  success
} = require('../../utils/emojis.json');
const {
  oneLine
} = require('common-tags');

module.exports = class SetAntiPhishingLogsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setantiphishinglogs',
      aliases: ['setapslogs'],
      usage: 'setantiphishinglogs <channel mention/ID>',
      description: oneLine `
      Set the Phishing logs text channel for your server.
      Provide no channel to clear the current \`Phishing logs\`.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setantiphishinglogs #phishing-logs', 'setantiphishinglogs 1234567890']
    });
  }
  async run(message, args) {

    let {
      antiPhishingLogsChannelID
    } = await message.client.mongodb.settings.antiPhishingLogsChannelID(message.guild.id)

    const oldPhishingLog = message.guild.channels.cache.get(antiPhishingLogsChannelID) || '`None`';

    const embed = new MessageEmbed()
      .setTitle('Settings: `Logging`')
      .setThumbnail(message.guild.iconURL({
        dynamic: true
      }))
      .setDescription(`The \`phishing log\` was successfully updated. ${success}`)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({
          dynamic: true
        })
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      await message.client.mongodb.settings.updateAntiPhishingLogsChannelID(message.guild.id, null);
      return message.channel.send({
        embeds: [embed.addField('Phising Log', `${oldPhishingLog} ➔ \`None\``)]
      });
    }

    const phishingLog = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!phishingLog || phishingLog.type !== 'GUILD_TEXT' || !phishingLog.viewable)
      return this.sendErrorMessage(message, 0, stripIndent `
            Please mention an accessible text channel or provide a valid text channel ID
          `);
    await message.client.mongodb.settings.updateAntiPhishingLogsChannelID(message.guild.id, phishingLog.id);
    message.channel.send({
      embeds: [embed.addField('Phising Log', `${oldPhishingLog} ➔ ${phishingLog}`)]
    });
  }
};