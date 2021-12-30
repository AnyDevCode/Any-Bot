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
    let mod = ["mod", "elder"] 
        
    let capture = char[Math.floor(char.length * Math.random())];  
    let colorize = color[Math.floor(color.length * Math.random())];
    let moder = mod[Math.floor(mod.length * Math.random())];  
    
    
    let autor = stringToUrlEncoded(message.author.username)
        
    let txt = stringToUrlEncoded(args.join(' '))
        
    if (!txt) return message.channel.send("Do not forget to put the text you want.") 

    let links = [`https://gdcolon.com/tools/gdtextbox/img/${txt}?${colorize}=purple&name=${autor}&char=${capture}`, `https://gdcolon.com/tools/gdcomment/img/${txt}?name=${autor}&likes=${Math.floor(500 * Math.random())}&%=${Math.floor(100 * Math.random())}&mod=${moder}&customIcon=${autor}` ]
        
    let image = links[Math.floor(links.length * Math.random())]; 
    
    let attachment = new Discord.MessageAttachment(image, "GD.png");
    
    message.channel.send(attachment) 
  }
};
