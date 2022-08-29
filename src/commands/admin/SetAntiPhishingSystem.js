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

    if (!args[0]) return this.sendErrorMessage(message, 0, 'Please provide a level System')

    let [level] = args;
    level = parseInt(level);

    if (isNaN(level)) return this.sendErrorMessage(message, 0, 'Please provide a level System')
    if (level < 0 || level > 4) return this.sendErrorMessage(message, 0, 'Please provide a valid level System')

    const {
      antiPhishingSystem
    } = await message.client.mongodb.settings.antiPhishingSystem(message.guild.id)

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

    if (antiPhishingSystem === level) return this.sendErrorMessage(message, 0, 'The anti-phishing system is already set to this level')

    await message.client.mongodb.settings.updateAntiPhishingSystem(message.guild.id, level)

    embed.setDescription(`The anti-phishing system has been successfully set to level **${level}**. ${success}`)
      .setFields([{
        name: 'Level',
        value: `\`${antiPhishingSystem}\` ➔ \`${level}\``
      }])

    return message.channel.send({
      embeds: [embed]
    })

  }
};