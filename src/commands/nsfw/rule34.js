const Command = require('../Command.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const booru = require("booru")

module.exports = class Rule34Command extends Command {
  constructor(client) {
    super(client, {
      name: 'rule34',
      aliases: ['r34'],
      usage: 'rule34 [tag]',
      description: 'Command with which you can search for images in rule34',
      nsfw: true,
      type: client.types.NSFW
    });
  }
  async run(message, args) {
      if(!message.channel.nsfw) return await this.sendErrorMessage(message, 2, 'Please use in a NSFW channel');
      const {stringToUrlEncoded} = message.client.utils;
      const tags = []
      for (let i = 0; i < args.length; i++) {
          tags[i] = stringToUrlEncoded(args[i]);
      }
      if(!tags) return message.channel.send("Write something to look for in Rule 34.")
        booru.search('rule34', tags, { limit: 1, random: true })
        .then(posts => {
       for(let post of posts) {
       const embed = new MessageEmbed()
         .setColor(message.guild.me.displayHexColor)
         .setTitle(`Search result: ${tags.join(' ')}`)
         .setImage(post.fileUrl)
        const linkrow = new MessageActionRow()
          .addComponents(
            new MessageButton()
            .setLabel("Direct link")
            .setStyle("LINK")
            .setEmoji("🔗")
            .setURL("https://rule34.xxx/index.php?page=post&s=view&id=" + post.id)
          )
        message.channel.send({embeds: [embed], components: [linkrow]})
 }
 }).catch(() => {
   message.channel.send("No results found.")
 })
  }
}
