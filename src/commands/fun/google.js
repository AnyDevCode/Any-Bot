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

    const msg = await message.channel.send({content: 'Searching...'});

      const options = {
          host: "google.com",
          qs: {
              q: search,
              filter: 1,
              pws: 0
          },
          num: 50
      };

      let i = 0;

      const links = serp.search(options);

    let max = links.length - 1

    const embed = new MessageEmbed()
    .setAuthor({
      name: "Google",
      iconURL: "https://assets.stickpng.com/thumbs/5847f9cbcef1014c0b5e48c8.png"
    })
    .setTitle("Result to your search")
    .setDescription(`[${links[i].title}](https://google.com${links[i].url})`)
    .setTimestamp()
    .setColor(message.guild.me.displayHexColor)
    .setFooter({
      text: `Page : `+parseInt(i + 1)+`/`+parseInt(max + 1)
    })
    msg.edit({content:"Done", embeds:[embed]}).then(msg =>{
       msg.react('◀️')
       msg.react('⏹️')
       msg.react('▶️')
       msg.awaitReactions((reaction,user) => {
           if(message.author.id !== user.id){
               return;
           }
           if(reaction.emoji.name === '▶️'){
               if(i !== max){
                   i++
                   const embeds = new MessageEmbed()
                   .setAuthor({
                     name: "Google",
                      iconURL: "https://assets.stickpng.com/thumbs/5847f9cbcef1014c0b5e48c8.png"
                    })
                   .setTitle("Result to your search")
                   .setDescription(`[${links[i].title}](https://google.com${links[i].url})`)
                   .setTimestamp()
                   .setColor(message.guild.me.displayHexColor)
                   .setFooter({
                     text: "Page : " + parseInt(i + 1) + "/" + parseInt(max + 1),
                   })
                   msg.edit({embeds:[embeds]})
               }
           }
           if(reaction.emoji.name === '⏹️'){
               msg.reactions.cache.get('◀️').remove()
               msg.reactions.cache.get('⏹️').remove()
               msg.reactions.cache.get('▶️').remove()
               const embedsss = new MessageEmbed()
                    .setAuthor({
                      name: "Google",
                      iconURL: "https://assets.stickpng.com/thumbs/5847f9cbcef1014c0b5e48c8.png"
                    })
                   .setDescription("Thanks for using Google")
                   .setColor(message.guild.me.displayHexColor)
                   .setTimestamp()
                   msg.edit({embeds:[embedsss]});
           }
           if(reaction.emoji.name === '◀️'){
               if(i !== 0){
               i--
               const embedss = new MessageEmbed()
               .setAuthor({
                  name: "Google",
                  iconURL: "https://assets.stickpng.com/thumbs/5847f9cbcef1014c0b5e48c8.png"
                })
               .setTitle("Result to your search")
               .setDescription(`[${links[i].title}](https://google.com${links[i].url})`)
               .setTimestamp()
               .setColor(message.guild.me.displayHexColor)
               .setFooter({
                 name: `Page : `+parseInt(i + 1)+`/`+parseInt(max + 1)
               })
               msg.edit({embeds:[embedss]})
           }
       }
       })
    })

  }
};
