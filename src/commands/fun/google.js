const Command = require('../Command.js');
const serp = require("serp");
const { MessageEmbed } = require('discord.js');

module.exports = class GoogleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'google',
      usage: 'google <search>',
      description: 'Find an page in Google.',
      type: client.types.FUN
    });
  }
  async run(message, args) {



    let search = args.join(" ")
    if(!search){
        return message.channel.send('Insert the you want to search first')
    }

    var options = {
      host : "google.com",
      qs : {
        q : search,
        filter : 0,
        pws : 0
      },
      num : 50
    };

    var i = 0;

    const links = await serp.search(options);

    let max = links.length - 1

    const embed = new MessageEmbed()
    .setTitle("Result to your search")
    .setDescription(`[${links[i].title}](${links[i].url})`)
    .setTimestamp()
    .setColor(message.guild.me.displayHexColor)
    .setFooter(`Page : `+parseInt(i + 1)+`/`+parseInt(max + 1))
    message.channel.send(embed).then(msg =>{
       msg.react('◀️')
       msg.react('⏹️')
       msg.react('▶️')
       msg.awaitReactions((reaction,user) => {
           if(message.author.id != user.id){
               return;
           }
           if(reaction.emoji.name === '▶️'){
               if(i != max){
                   i++
                   const embeds = new MessageEmbed()
                   .setTitle("Result to your search")
                   .setDescription(`[${links[i].title}](${links[i].url})`)
                   .setTimestamp()
                   .setColor(message.guild.me.displayHexColor)
                   .setFooter(`Page : `+parseInt(i + 1)+`/`+parseInt(max + 1))
                   msg.edit(embeds)
               }
           }
           if(reaction.emoji.name === '⏹️'){
               msg.reactions.cache.get('◀️').remove()
               msg.reactions.cache.get('⏹️').remove()
               msg.reactions.cache.get('▶️').remove()
               const embedsss = new MessageEmbed()
                   .setImage('https://assets.stickpng.com/thumbs/5847f9cbcef1014c0b5e48c8.png')
                   .setFooter(`Page : `+parseInt(i + 1)+`/`+parseInt(max + 1))
                   .setTimestamp()
                   msg.edit(embedsss);
           }
           if(reaction.emoji.name === '◀️'){
               if(1 != i){
               i--
               const embedss = new MessageEmbed()
               .setTitle("Result to your search")
               .setDescription(`[${links[i].title}](${links[i].url})`)
               .setTimestamp()
               .setColor(message.guild.me.displayHexColor)
               .setFooter(`Page : `+parseInt(i + 1)+`/`+parseInt(max + 1))
               msg.edit(embedss)
           }
       }
       })
    })

  }
};
