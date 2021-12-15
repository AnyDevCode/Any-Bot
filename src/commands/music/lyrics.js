const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class LyricsMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lyrics',
      usage: 'lyrics [song name]',
      description: 'Shows the lyrics to the currently-playing song',
      examples: ['lyrics', 'lyrics Show Yourself CG5'],
      type: client.types.MUSIC,
      disabled: true
    });
  }
  async run(message) {
    }
  };
