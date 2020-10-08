const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const Discord = require("discord.js");
const axios = require('axios');


module.exports = class MinecraftServerCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mcserver',
      aliases: ['mcsv'],
      usage: 'mcserver <ip> [port]',
      description: 'It tells you the information of a Minecraft server.',
      type: client.types.GAMES
    });
  }
  async run(message, args) {
const util = require('minecraft-server-util');
const request = require("request");
      
	 if(!args[0]) return message.channel.send('You have to put the ip of a server.') // Por si no ponen una ip
 var port = args[1]
if(!port) {
  port = `25565` 
} // Si no ponen un puerto, el predeterminado será 25565
    
    let pingURL = `https://api.minetools.eu/ping/${args[0]}` // Es la herramienta de donde se sacara una parte de la informacion del servidor
  
  request(pingURL, function(err, resp, body){
    if(err) return console.log(err.message);
    body = JSON.parse(body);
    if(body.error) return message.channel.send(": x: `Error | Server offline or not available.`") // Si la herramienta no encuentra nada sobre la ip
    
     let motd = `http://status.mclive.eu/MinecraftServer/${args[0]}/25565/banner.png` // Imagen del motd del servidor.
 
            util.status(`${args[0]}`, { port: parseInt(port) })
                .then((response) => {
                const Embed = new Discord.MessageEmbed()
                .setTitle('Server Status')
                .addField('Server IP', response.host) // ip del servidor
                .addField('Server Version', response.version) // version del servidor
                .addField('Latency', `${(body.latency).toFixed(2)} ms`) // latencia del servidor con pingURL y request
                .addField('Online Players', response.onlinePlayers + "/" + response.maxPlayers) // Jugadores online y limite de jugadores
                .setImage(motd) // Motd antes definido
                .setThumbnail('https://cdn.glitch.com/402b9099-0636-457a-8ffb-faf65c857490%2F1.png?v=1585792839856') // Totalmente opcional.
                .setColor(message.guild.me.displayHexColor)
                 
                message.channel.send(Embed) //Envia el embed con la info del servidor
                 })
                 .catch((error) => {
                 message.channel.send('I can\'t find that server.');
                 });// Usando minecraft-server-until para sacar informacion mas especifica
                
                } )
  
                 
                  }}