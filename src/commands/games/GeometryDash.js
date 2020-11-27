const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const fetch = require('node-fetch');
const axios = require('axios')
const GDClient = require('geometry-dash-api'); // Primero, instalar la api, npm i geometry-dash-api

module.exports = class GeometryDashCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'geometrydash',
      aliases: ['gduser'],
      usage: 'gduser <name>',
      description: 'It says that there is that day in the Fortnite item store.Show information about any GeometryDash user.',
      type: client.types.GAMES,
      examples: ['geometrydash Guillester']
    });
  }
  async run(message, args) {
    if(!args[0]) return message.reply("Please put some username");

    const GD = new GDClient({
      userName: message.client.apiKeys.geometrydash.user, 
      password: message.client.apiKeys.geometrydash.password 
    });
  
    const { api } = GD; 
    
    await GD.login(); 
    
    const user = await api.users.getByNick(args.join(" "));
      
      if(!user) return message.channel.send("User was not found") 
      const embed = new MessageEmbed()
      .setTitle(user.nick)
      .setColor(message.guild.me.displayHexColor)
      .addField('Stars',user.stars, true)
      .addField('Coins',user.coins, true)
      .addField('User Coins',user.userCoins, true)
      .addField('Diamonds',user.diamonds, true)
      .addField('Creator Points',user.creatorPoints, true)
      .addField('Demons', user.demons, true)
      .setFooter('Top: '+user.top)
      .setTimestamp()
      message.channel.send(embed)

}
}
