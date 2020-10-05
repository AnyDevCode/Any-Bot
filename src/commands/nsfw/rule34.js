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
      type: client.types.NSFW
    });
  }
  async run(message, args) {
	  if(!message.channel.nsfw) return message.channel.send("Sorry but this channel is not NSFW.")
       const tags = args.join(" ") //los tags que buscaremos
      if(!tags) return message.channel.send("Write something to look for in Rule 34.")
        booru.search('rule34', [tags], { limit: 1, random: true })//el primero es para buscar en la rule 34, luego se busca con los tags, luego agarramos una sola imagen y que sea una imagen aleatoria
        .then(posts => {//el json como toda la informacion
       for(let post of posts) {//luego la parte post de posts
       const embed = new Discord.MessageEmbed()//creamos el embed
         .setColor(message.guild.me.displayHexColor)
         .setTitle(`Search result: ${tags}`)
         .setImage(post.fileUrl)//fileUrl es el URL directo de la imagen
    message.channel.send({ embed }) //mandamos el embed
 }
 }).catch(e => message.channel.send("error "+e))//un catch por si da error
  }
};
