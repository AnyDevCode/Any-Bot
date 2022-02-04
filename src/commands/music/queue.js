const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class QueueMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'queue',
      usage: 'queue <page>',
      aliases: ['list'],
      description: 'Shows the current queue',
	  examples: ['queue', 'queue 2'],
      type: client.types.MUSIC
    });
  }
  async run(message, args) {
    let queue = message.client.queue();

    const server_queue = queue.get(message.guild.id);
    if (!server_queue) return this.sendErrorMessage(message, 1, 'There is nothing playing.');
    if (!message.member.voice.channel) return this.sendErrorMessage(message, 1, 'You have to be in a voice channel to use this command.');
    if (message.member.voice.channel !== message.guild.me.voice.channel) return this.sendErrorMessage(message, 1, 'You have to be in the same voice channel as the bot to use this command.');

    let songs = server_queue.songs;
    if(songs.length === 0) return this.sendErrorMessage(message, 1, 'There is nothing in the queue.');
    let page = 1;
    if (args.length > 0) {
      page = parseInt(args[0]);
      if(page < 1) page = 1;
      if(page > Math.ceil(songs.length / 10)) page = Math.ceil(songs.length / 10);
      if (isNaN(page)) page = 1;
    }

    let embed = new MessageEmbed()
      .setAuthor('Current Queue', message.guild.iconURL())
      .setColor(message.guild.me.displayHexColor)
      .setFooter(`Page ${page} of ${Math.ceil(songs.length / 10)}`);

    let start = (page - 1) * 10;
    let end = start + 10;
    if (end > songs.length) end = songs.length;
    for (let i = start; i < end; i++) {
      let song = songs[i];
      if(i === 0) embed.addField('Now Playing', `[${song.title}](${song.url})`);
      else embed.addField(`${i}. ${song.title}`, `[${song.url}](${song.url})`);
    }
    return message.channel.send(embed);
  }
  };
