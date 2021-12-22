const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class NowPlayingMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'nowplaying',
      usage: 'nowplaying',
      aliases: ['np', 'current'],
      description: 'Shows the song that is currently playing',
      type: client.types.MUSIC,
    });
  }
  async run(message) {
    let queue = message.client.queue();

    const server_queue = queue.get(message.guild.id);

    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    if(!server_queue){
        return message.channel.send(`There are no songs in queue 😔`);
    }
    let embed = new MessageEmbed()
    .setColor(message.guild.me.displayHexColor)
    .setTitle(`Now playing: ${server_queue.songs[0].title}`)
    .setDescription(`[${server_queue.songs[0].title}](${server_queue.songs[0].url})`)
    .addField('Requested by', `<@!${server_queue.songs[0].requester}>`)
    .addField('Duration', `${server_queue.songs[0].duration}`)
    .setImage(server_queue.songs[0].thumbnail)
    .setTimestamp()
    .setFooter(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }));
    return message.channel.send(embed);
    }
  };
