const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const booru = require("booru")
const Discord = require('discord.js')

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
	  if(!message.channel.nsfw) return this.sendErrorMessage(message, 2, 'Please use in a NSFW channel');
       const tags = args.join(" ").replace(" ", "%20")
      if(!tags) return message.channel.send("Write something to look for in Rule 34.")
        booru.search('rule34', [tags], { limit: 1, random: true })
        .then(posts => {
       for(let post of posts) {
       const embed = new Discord.MessageEmbed()
         .setColor(message.guild.me.displayHexColor)
         .setTitle(`Search result: ${tags}`)
         .setImage(post.fileUrl)
    message.channel.send({ embed })
 }
 }).catch(e => message.channel.send("error "+e))
  }
};
