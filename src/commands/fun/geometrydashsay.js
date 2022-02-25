const Command = require('../Command.js');
const Discord = require('discord.js');


module.exports = class GeometryDashsayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'geometrydashsay',
      aliases: ['gdsay', 'geometrydsay'],
      usage: 'geometrydash <message>',
      description: 'He answers what you tell him.',
      type: client.types.FUN
    });
  }
  async run(message, args) {

    const {stringToUrlEncoded} = message.client.utils;
    
    let char = ["gatekeeper", "gatekeeper.dark", "keymaster", "keymaster.huh", "keymaster.scared", "keymaster.scream", "monster", "monster.eyes", "potbor", "potbor.annoyed", "potbor.huh", "potbor.mad", "potbor.right", "potbor.talk", "potbor.tired", "scratch", "scratch.annoyed", "scratch.huh", "scratch.mad", "scratch.right", "scratch.talk", "shopkeeper", "shopkeeper.annoyed", "spooky"]   
    let color = ["blue", "brown", "purple", "aqua", "green", "grey", "orange", "pink", "red"] 

    let capture = char[Math.floor(char.length * Math.random())];  
    let colorize = color[Math.floor(color.length * Math.random())];
    
    let autor = stringToUrlEncoded(message.author.username)
        
    let txt = stringToUrlEncoded(args.join(' '))
        
    if (!txt) return message.channel.send("Do not forget to put the text you want.") 

    let links = [`https://gdcolon.com/tools/gdtextbox/img/${txt}?color=${colorize}&name=${autor}&char=${capture}`]
        
    let image = links[0];
    
    let attachment = new Discord.MessageAttachment(image, "GD.png");
    
    message.channel.send({files: [attachment]}) 
  }
};
