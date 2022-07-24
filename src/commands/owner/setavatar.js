const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class SetAvatarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setavatar',
      usage: 'setavatar <attachments>',
      description: 'Sets the avatar of the bot to the image attached.',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['setavatar [attachment]']
    });
  }
  async run(message) {
    //Check if have attachment
    if (!message.attachments.size) return this.sendErrorMessage(message, 0, 'Please attach an image to set the avatar to.');
    //Get attachment
    const attachment = message.attachments.first();
    //Set avatar
    message.client.user.setAvatar(attachment.url).then(() => {
      const embed = new MessageEmbed()
        .setTitle('Avatar Set')
        .setDescription(`Avatar set to the image attached.`)
        .setColor(message.guild.me.displayHexColor)
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setImage(attachment.url);
      message.channel.send({embeds: [embed]});
    }).catch(async () => {
      await this.sendErrorMessage(message, 1, 'Failed to set avatar.');
    });
  } 
};