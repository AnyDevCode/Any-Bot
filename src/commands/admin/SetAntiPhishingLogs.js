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

    const lang_text = this.getLanguage();

    let {
      antiPhishingLogsChannelID
    } = await message.client.mongodb.settings.antiPhishingLogsChannelID(message.guild.id)

    const oldPhishingLog = message.guild.channels.cache.get(antiPhishingLogsChannelID) || lang_text.fields.none;

    const embed = new MessageEmbed()
      .setTitle(lang_text.fields.title)
      .setThumbnail(message.guild.iconURL({
        dynamic: true
      }))
      .setDescription(lang_text.fields.description.replace('%{success}', success))
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
        embeds: [embed.addField(lang_text.messages.phishing_channel, lang_text.messages.channel_to_none.replace('%{oldPhishingLog}', oldPhishingLog))]
      });
    }

    const phishingLog = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!phishingLog || phishingLog.type !== 'GUILD_TEXT' || !phishingLog.viewable)
      return this.sendErrorMessage(message, 0, lang_text.errors.invalid_channel_or_id);
    await message.client.mongodb.settings.updateAntiPhishingLogsChannelID(message.guild.id, phishingLog.id);
    message.channel.send({
      embeds: [embed.addField(lang_text.fields.title, `${oldPhishingLog} ➔ ${phishingLog}`)]
    });
  }
};