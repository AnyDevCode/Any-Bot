const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class QueueMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'queue',
      usage: 'queue [pagenum]',
      aliases: ['list'],
      description: 'Shows the current queue',
	  examples: ['queue', 'queue 2'],
      type: client.types.MUSIC
    });
  }
  async run(message) {
    let queue = message.client.queue();

    const server_queue = queue.get(message.guild.id);
    if (!server_queue) return this.sendErrorMessage(message, 1, 'There is nothing playing.');
    if (!message.member.voice.channel) return this.sendErrorMessage(message, 1, 'You have to be in a voice channel to use this command.');
    if (message.member.voice.channel !== message.guild.me.voice.channel) return this.sendErrorMessage(message, 1, 'You have to be in the same voice channel as the bot to use this command.');

    const embed = new MessageEmbed()
      .setAuthor(`${message.guild.name} Music Queue`, message.guild.iconURL())
      .setDescription(`${server_queue.songs.map(song => `[${song.title}](${song.url})`).join('\n')}`)
      .setColor(message.guild.me.displayHexColor);
    return message.channel.send(embed);
  }
  };
