const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const fetch = require('node-fetch');
const axios = require('axios')

module.exports = class FortniteShopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'fortniteshop',
      aliases: ['ftshop'],
      description: 'It says that there is that day in the Fortnite item store.',
      type: client.types.GAMES
    });
  }
  async run(message, args) {
          const apiKey = message.client.apiKeys.fortniteshopApi;
const swiftcord = require("swiftcord") //requerimos
const canva = new swiftcord.Canvas() //el canvas de swiftcord
const image = await canva.Fortnite() //necesitaremos tener el evento message asincrono
.setKey(apiKey)
.toAttachment() //la convertimos en un attachment
let attachment = new Discord.MessageAttachment(image, "tienda.png") //hacemos un attachment de la tienda
return message.channel.send(attachment) //enviamos el attachment
}}
