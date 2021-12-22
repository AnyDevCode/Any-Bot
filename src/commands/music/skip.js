const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class QueueMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      usage: 'skip',
      aliases: ['voteskip'],
      description: 'Votes to skip the current song',
      type: client.types.MUSIC,
    });
  }
  async run(message) {
    let queue = message.client.queue();

    const server_queue = queue.get(message.guild.id);
    if (!server_queue) return this.sendErrorMessage(message, 1, 'There is nothing playing.');
    if (!message.member.voice.channel) return this.sendErrorMessage(message, 1, 'You have to be in a voice channel to use this command.');
    if (message.member.voice.channel !== message.guild.me.voice.channel) return this.sendErrorMessage(message, 1, 'You have to be in the same voice channel as the bot to use this command.');
    if (message.member.permissions.has('ADMINISTRATOR') || server_queue.songs[0].requester === message.author.id) {


    const skip_song = async (message, server_queue) => message.client.utils.skip_song(message, server_queue);

    skip_song(message, server_queue);

    } else {
      return this.sendErrorMessage(message, 1, 'You have to be the song requester to use this command.');

    }}

  };
