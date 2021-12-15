const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ImagesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'images',
      usage: 'images <search>',
      description: 'Find an image in Google.',
      type: client.types.FUN
    });
  }
  async run(message, args) {

    let search = args.join(" ")
    if(!search){
        return message.channel.send('Insert the you want to search first')
    }

    var gis = require('g-i-s');
    gis(search, logResults);


    function logResults(error, results) {
      if (error) {
        return message.channel.send('Sorry, I didn\'t find the images, try again')
      }
      else {

    var i = 0;

    let max = results.length - 1



    const embed = new MessageEmbed()
    .setTitle("Result to your search")
    .setImage(results[i].url)
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
                   .setImage(results[i].url)
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
               .setImage(results[i].url)
               .setTimestamp()
               .setColor(message.guild.me.displayHexColor)
               .setFooter(`Page : `+parseInt(i + 1)+`/`+parseInt(max + 1))
               msg.edit(embedss)
           }
       }
       })
    })

  }
}
}
};
