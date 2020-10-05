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
      type: client.types.MUSIC
    });
  }
  async run(message) {
    }
  };
