const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const Discord = require("discord.js");
const superagent = require('superagent')
const fetch = require('node-fetch');
const axios = require('axios')

module.exports = class MinecraftArchievementCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mcachievement',
      aliases: ['mcam'],
      usage: 'mcachievement <text>',
      description: 'Turn your text into a Minecraft achievement.',
      type: client.types.GAMES
    });
  }
  async run(message, args) {
try {
let text = args.join(" "); 
 if (!text) return message.channel.send("Write some text for the achievement."); 
 if (text.length > 23) return message.channel.send("The achievement can only contain up to 23 characters."); 
 if (text.length < 2) return message.channel.send("The achievement must contain more than 2 characters."); 

let links = ["https://www.minecraftskinstealer.com/achievement/a.php?i=38", "https://www.minecraftskinstealer.com/achievement/a.php?i=1", "https://www.minecraftskinstealer.com/achievement/a.php?i=21", "https://www.minecraftskinstealer.com/achievement/a.php?i=20", "https://www.minecraftskinstealer.com/achievement/a.php?i=13", "https://www.minecraftskinstealer.com/achievement/a.php?i=18", "https://www.minecraftskinstealer.com/achievement/a.php?i=17", "https://www.minecraftskinstealer.com/achievement/a.php?i=9", "https://www.minecraftskinstealer.com/achievement/a.php?i=31", "https://www.minecraftskinstealer.com/achievement/a.php?i=22", "https://www.minecraftskinstealer.com/achievement/a.php?i=23", "https://www.minecraftskinstealer.com/achievement/a.php?i=2", "https://www.minecraftskinstealer.com/achievement/a.php?i=11", "https://www.minecraftskinstealer.com/achievement/a.php?i=19", "https://www.minecraftskinstealer.com/achievement/a.php?i=33", "https://www.minecraftskinstealer.com/achievement/a.php?i=34", "https://www.minecraftskinstealer.com/achievement/a.php?i=26", "https://www.minecraftskinstealer.com/achievement/a.php?i=35", "https://www.minecraftskinstealer.com/achievement/a.php?i=6", "https://www.minecraftskinstealer.com/achievement/a.php?i=7", "https://www.minecraftskinstealer.com/achievement/a.php?i=10", "https://www.minecraftskinstealer.com/achievement/a.php?i=39", "https://www.minecraftskinstealer.com/achievement/a.php?i=4", "https://www.minecraftskinstealer.com/achievement/a.php?i=5", "https://www.minecraftskinstealer.com/achievement/a.php?i=28"] //Links de los logros. (Yo solo añadí algunos, puedes seguir añadiendo más si quieres)
 
const { body } = await superagent
.get(links[Math.floor(Math.random() * links.length)])
.query({
  h: 'Achievement get!',
  t: text
});
  
message.channel.send({ files: [{ attachment: body, name: 'Achievement.png' }] 
                      
});
} catch (err) {
console.log(err)
}
}}