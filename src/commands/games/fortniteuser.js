const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const fetch = require('node-fetch');
const axios = require('axios')
const canvas = require("discord-canvas");
const stats = new canvas.FortniteStats();

module.exports = class FortniteUserCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'fortniteuser',
      aliases: ['ftuser'],
      usage: 'fortniteuser <psn/xbl/pc> <name>',
      description: 'Shows Fortnite user information.',
      type: client.types.GAMES,
      examples: ['fortniteuser pc Ninja']
    });
  }
  async run(message, args) {
          const apiKey = message.client.apiKeys.fortniteApi;

          const user = args.slice(1).join(" ");
          const platform = args[0];
          
        let image = await stats
          .setToken(apiKey)
          .setUser(user)
          .setPlatform(platform)
          .toAttachment();
          
          if (!user) return message.channel.send("Please enter a User")
          if (!platform) return message.channel.send("Please enter a valid platform how psn/xbl/pc")
          if (platform !== "pc" && platform !== "xbl" && platform !== "psn") return message.channel.send("Please enter a valid platform")
          if (!image) return message.channel.send("User not found")
           
          let attachment = new Discord.MessageAttachment(image.toBuffer(), "FortniteStats.png");
           
          message.channel.send(attachment);
}}
