const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class QueueMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'queue',
      usage: 'queue [pagenum]',
      aliases: ['list'],
      description: 'Shows the current queue',
	  examples: ['queue', 'queue 2'],
      type: client.types.MUSIC,
      disabled: true
    });
  }
  async run(message) {
    }
  };
