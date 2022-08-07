const Command = require('../Command.js');
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require('discord.js');
const {
  oneLine
} = require('common-tags');

module.exports = class SetFarewellMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setfarewellmessage',
      aliases: ['setfarewellmsg', 'setfm', 'sfm'],
      usage: 'setfarewellmessage <message>',
      description: oneLine `
        Sets the message Any Bot will say when someone leaves your server.
        You may use \`?member\` to substitute for a user mention,
        \`?username\` to substitute for someone's username,
        \`?tag\` to substitute for someone's full Discord tag (username + discriminator),
        and \`?size\` to substitute for your server's current member count.
        Enter no message to clear the current \`farewell message\`.
        A \`farewell channel\` must also be set to enable farewell messages.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setfarewellmessage ?member has left the server.']
    });
  }
  run(message) {

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setLabel("Dashboard")
        .setStyle("LINK")
        .setURL(
          `https://dashboard.any-bot.tech/guild/${message.guild.id}`
        )
        .setEmoji("🔗"),
      );

    message.channel.send({
      embeds: [
        new MessageEmbed()
        .setTitle('Setting Farewell Message')
        .setDescription(
          oneLine `
              This command was moved to the [dashboard](https://dashboard.any-bot.tech).
              Please use the link below to set your farewell message.
              `
        )
        .setURL('https://dashboard.any-bot.tech/settings')
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