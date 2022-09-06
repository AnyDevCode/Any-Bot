const Command = require('../Command.js');
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require('discord.js');
const {
  success
} = require('../../utils/emojis.json');
const {
  oneLine
} = require('common-tags');

module.exports = class SetWelcomeMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setwelcomemessage',
      aliases: ['setwelcomemsg', 'setwm', 'swm'],
      usage: 'setwelcomemessage <message>',
      description: oneLine `
        Sets the message Any Bot will say when someone joins your server.
        You may use \`?member\` to substitute for a user mention,
        \`?username\` to substitute for someone's username,
        \`?tag\` to substitute for someone's full Discord tag (username + discriminator),
        \`?size\` to substitute for your server's current member count,
        \`?guild\` to substitute for your server's name,
        Enter no message to clear the current \`welcome message\`.
        A \`welcome channel\` must also be set to enable welcome messages.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setwelcomemessage ?member has joined the server!']
    });
  }
  run(message) {

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setLabel("Dashboard")
        .setStyle("LINK")
        .setURL(
          `https://dashboard.any-bot.xyz/guild/${message.guild.id}`
        )
        .setEmoji("🔗"),
      );

    message.channel.send({
      embeds: [
        new MessageEmbed()
        .setTitle('Setting Welcome Message')
        .setDescription(
          oneLine `
              This command was moved to the [dashboard](https://dashboard.any-bot.xyz).
              Please use the link below to set your welcome message.
              `
        )
        .setURL('https://dashboard.any-bot.xyz/settings')
        .setColor(message.guild.me.displayHexColor)
        .setTimestamp()
        .setFooter({
          text: `${message.guild.name} ${this.client.user.username}`,
          icon_url: this.client.user.displayAvatarURL({
            format: 'png',
            dynamic: true
          })
        })
      ],
      components: [row]

    })
  }
};