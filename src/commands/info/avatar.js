const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
module.exports = class AvatarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      aliases: ['profilepic', 'pic', 'ava'],
      usage: 'avatar [user mention/ID]',
      description: 'Displays a user\'s avatar (or your own, if no user is mentioned).',
      type: client.types.INFO,
      examples: ['avatar @MDC']
    });
  }
  async run(message, args) {
    async function customAvatar(user) {
    const data = await axios.get(`https://discord.com/api/guilds/${message.guild.id}/members/${user.id}`, {
        headers: {
            Authorization: `Bot ${message.client.token}`
        }
    }).then(d => d.data);


    if(data.avatar && data.avatar != user.avatar){
      let url = data.avatar.startsWith("a_") ? ".gif?size=4096" : ".png?size=4096";
      url = `https://cdn.discordapp.com/guilds/${message.guild.id}/users/${user.id}/avatars/${data.avatar}${url}`;
      return url;
  } else {
      return null;
  }
}
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const embed = new MessageEmbed()
      .setTitle(`${member.displayName}'s Avatar`)
      .setImage(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      }) 
      .addField("Download Original Avatar", `[Click here](${member.user.displayAvatarURL({ dynamic: true, size: 4096 })})`)
      .setTimestamp()
      .setColor(member.displayHexColor);

      let embed2

      const customavatar = await customAvatar(member.user);
      if (customavatar) {
        embed2 = new MessageEmbed()
        embed2.setURL("https://any-bot.tech")
        embed2.setImage(customavatar)

        embed.addField("Download Custom Avatar", `[Click here](${customavatar})`)
        embed.setURL("https://any-bot.tech")
      }

      if(embed2){
        message.channel.send({embeds: [embed, embed2]})
      }
      else{
        message.channel.send({embeds: [embed]})
      }
  }
};
