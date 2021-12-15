const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const {searchAmazon, AmazonSearchResult} = require('unofficial-amazon-search');

module.exports = class AmazonCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'amazon',
      usage: 'amazon <article>',
      description: 'Find an Amazon Product.',
      type: client.types.FUN
    });
  }
  async run(message, args) {
    let article = args.join(" ")
    if(!article){
        return message.channel.send('Insert the product you want to search first')
    }
    var i = 0;
   searchAmazon(article).then(res => {
      let max = res.searchResults.length - 1;
       const embed = new MessageEmbed()
       .setTitle(res.searchResults[i].title)
       .setURL("https://amazon.com"+res.searchResults[i].productUrl)
       .addField('Name:',res.searchResults[i].title)
       .addField('Stars:',res.searchResults[i].rating.score + '/' + res.searchResults[i].rating.outOf,true)
       .addField('Price:',res.searchResults[i].prices[0].price ? "$"+res.searchResults[i].prices[0].price : "Free",true)
       .addField('For:',res.searchResults[i].prices[0].label ? res.searchResults[i].prices[0].label : "Physical Object or Digital Object",true)
       .setImage(res.searchResults[i].imageUrl)
       .setTimestamp()
       .setColor(message.guild.me.displayHexColor)
       .setFooter(`Page : `+parseInt(i + 1)+`/`+parseInt(max + 1))
       .setThumbnail('https://i.imgur.com/4gVj6Xf.png')
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
                      .setTitle(res.searchResults[i].title)
                      .setURL("https://amazon.com"+res.searchResults[i].productUrl)
                      .addField('Name:',res.searchResults[i].title)
                      .addField('Stars:',res.searchResults[i].rating.score + '/' + res.searchResults[i].rating.outOf,true)
                      .addField('Price:',res.searchResults[i].prices[0].price ? "$"+res.searchResults[i].prices[0].price : "Free",true)
                      .addField('For:',res.searchResults[i].prices[0].label ? res.searchResults[i].prices[0].label : "Physical Object or Digital Object",true)
                      .setImage(res.searchResults[i].imageUrl)
                      .setTimestamp()
                      .setColor(message.guild.me.displayHexColor)
                      .setFooter(`Page : `+parseInt(i + 1)+`/`+parseInt(max + 1))
                      .setThumbnail('https://i.imgur.com/4gVj6Xf.png')
                      msg.edit(embeds)
                  }
              }
              if(reaction.emoji.name === '⏹️'){
                  msg.reactions.cache.get('◀️').remove()
                  msg.reactions.cache.get('⏹️').remove()
                  msg.reactions.cache.get('▶️').remove()
                  const embedsss = new MessageEmbed()
                      .setTitle('Amazon')
                      .setImage('https://i.imgur.com/4gVj6Xf.png')
                      .setFooter(`Page : `+parseInt(i + 1)+`/`+parseInt(max + 1))
                      .setTimestamp()
                      msg.edit(embedsss);
              }
              if(reaction.emoji.name === '◀️'){
                  if(1 != i){
                  i--
                  const embedss = new MessageEmbed()
                  .setTitle(res.searchResults[i].title)
                  .setURL("https://amazon.com"+res.searchResults[i].productUrl)
                  .addField('Name:',res.searchResults[i].title)
                  .addField('Stars:',res.searchResults[i].rating.score + '/' + res.searchResults[i].rating.outOf,true)
                  .addField('Price:',res.searchResults[i].prices[0].price ? "$"+res.searchResults[i].prices[0].price : "Free",true)
                  .addField('For:',res.searchResults[i].prices[0].label ? res.searchResults[i].prices[0].label : "Physical Object or Digital Object",true)
                  .setImage(res.searchResults[i].imageUrl)
                  .setTimestamp()
                  .setColor(message.guild.me.displayHexColor)
                  .setFooter(`Page : `+parseInt(i + 1)+`/`+parseInt(max + 1))
                  .setThumbnail('https://i.imgur.com/4gVj6Xf.png')
                  msg.edit(embedss)
              }
          }
          })
       })
    }).catch(error =>{
        return message.channel.send('Sorry, I didn\'t find the product, try again')
    })
  }
};
