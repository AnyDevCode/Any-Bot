const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class PlayListCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'playlists',
      usage: 'playlists',
      aliases: ['pls'],
      description: 'Shows the available playlists',
      type: client.types.MUSIC
    });
  }
  async run(message) {
    }
  };
