const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine } = require('common-tags');

module.exports = class SetFarewellMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setfarewellmessage',
      aliases: ['setfarewellmsg', 'setfm', 'sfm'],
      usage: 'setfarewellmessage <message>',
      description: oneLine`
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
  async run(message, args) {

    let { farewellChannelID: farewellChannelId, farewellMessage: oldFarewellMessage } =
        await message.client.mongodb.settings.selectRow(message.guild.id);
    const farewellChannel = message.guild.channels.cache.get(farewellChannelId);

    if(oldFarewellMessage[0].data.text){
      oldFarewellMessage = oldFarewellMessage[0].data.text;
    } else {
      oldFarewellMessage = null;
    }

    // Get status
    const oldStatus = message.client.utils.getStatus(farewellChannelId, oldFarewellMessage);

    const embed = new MessageEmbed()
      .setTitle('Settings: `Farewells`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`farewell message\` was successfully updated. ${success}`)
      .addField('Channel', farewellChannel ? `<#${farewellChannel.id}>` : '`None`', true)
      .setFooter({text:message.member.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })})
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (!args[0]) {
      await message.client.mongodb.settings.updateFarewellMessage(null, message.guild.id);

      // Update status
      const status = 'disabled';
      const statusUpdate = (oldStatus !== status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

      return message.channel.send({embeds:[embed
        .addField('Status', statusUpdate, true)
        .addField('Message', '`None`')
      ]});
    }
    
    let farewellMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    await message.client.mongodb.settings.updateFarewellMessage(farewellMessage, message.guild.id);
    if (farewellMessage.length > 1024) farewellMessage = farewellMessage.slice(0, 1021) + '...';

    // Update status
    const status =  message.client.utils.getStatus(farewellChannel, farewellMessage);
    const statusUpdate = (oldStatus !== status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;
    
    message.channel.send({embeds:[embed
      .addField('Status', statusUpdate, true)
      .addField('Message', message.client.utils.replaceKeywords(farewellMessage))
    ]});
  }
};