const Command = require('../Command.js');
const {
  MessageEmbed
} = require('discord.js');
const {
  success
} = require('../../utils/emojis.json');
const {
  stripIndent
} = require('common-tags');

module.exports = class SetAntiPhishingSystemCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setantiphishingsystem',
      aliases: ['setaps'],
      usage: 'setantiphishingsystem <level>',
      description: stripIndent `
        Set the level of the anti-phishing system.
        \`\`\`js
        Levels:
        0 - None
        1 - Delete messages
        2 - Delete messages and Timeout the User for 1 week
        3 - Delete messages and Kick the User
        4 - Delete messages and Ban the User
        \`\`\`
        \`\`\`js
        Disclaimer:
        1. This feature is not 100% accurate.
        2. If the user is not kickeable, banable or timed out, the bot send a message to channel informing the problem.
        \`\`\`
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setantiphishingsystem 2']
    });
  }
  async run(message, args) {

    const lang_text = this.getLanguage();

    if (!args[0]) return this.sendErrorMessage(message, 0, lang_text.errors.dont_provided_level);

    let [level] = args;
    level = parseInt(level);

    if (isNaN(level)) return this.sendErrorMessage(message, 0, lang_text.errors.dont_provided_level_2)
    if (level < 0 || level > 4) return this.sendErrorMessage(message, 0, lang_text.errors.dont_provided_level_2)

    const {
      antiPhishingSystem
    } = await message.client.mongodb.settings.antiPhishingSystem(message.guild.id)

    let embed = new MessageEmbed()
      .setTitle(lang_text.fields.title)
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

    if (antiPhishingSystem === level) return this.sendErrorMessage(message, 0, lang_text.errors.already_set)

    await message.client.mongodb.settings.updateAntiPhishingSystem(message.guild.id, level)

    embed.setDescription(lang_text.fields.description.replace('%{success}', success).replace('%{level}', level))
      .setFields([{
        name: lang_text.fields.name,
        value: `\`${antiPhishingSystem}\` ➔ \`${level}\``
      }])

    return message.channel.send({
      embeds: [embed]
    })

  }
};