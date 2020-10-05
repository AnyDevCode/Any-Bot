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
      type: client.types.MUSIC
    });
  }
  async run(message) {
    }
  };
