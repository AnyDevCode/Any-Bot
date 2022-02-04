const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class RemoveMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'remove',
      usage: 'remove <position|ALL>',
      aliases: ['delete'],
      description: 'Removes a song from the queue',
	  examples: ['remove 3', 'remove all'],
      type: client.types.MUSIC
    });
  }
  async run(message, args) {

    let queue = message.client.queue();

    const server_queue = queue.get(message.guild.id)

    if (!server_queue) return this.sendErrorMessage(message, 1, 'There is nothing playing.');
    if (!message.member.voice.channel) return this.sendErrorMessage(message, 1, 'You have to be in a voice channel to use this command.');
    if (message.member.voice.channel !== message.guild.me.voice.channel) return this.sendErrorMessage(message, 1, 'You have to be in the same voice channel as the bot to use this command.');

    if (!args[0]) return this.sendErrorMessage(message, 0, 'Please specify a position to remove.');
    //If args is not a number
    if (args[0] !== 'all' && isNaN(args[0])) return this.sendErrorMessage(message, 0, 'Please specify a valid position.');

    if (args[0] === 'all') {
      server_queue.songs = [];
      return message.channel.send('Removed all songs from the queue.');
    }

    if (args[0] > server_queue.songs.length) return this.sendErrorMessage(message, 0, 'Please specify a valid position.');

    //If args is a number 0 o less
    if (args[0] <= 0) return this.sendErrorMessage(message, 0, 'Please specify a valid position.');

    let args_num = parseInt(args[0]);

    server_queue.songs.splice(args_num, 1);

    return message.channel.send(`Removed song at position ${args_num} from the queue.`);

  }
  };
