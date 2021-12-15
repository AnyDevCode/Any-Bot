const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class PlayMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'play',
      usage: 'play <title|URL|subcommand>',
      description: 'Plays the provided song',
      examples: ['play NCS 1 Hour', 'play https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'play [file]'],
      type: client.types.MUSIC,
      disabled: true
    });
  }
  async run(message) {
    }
  };
