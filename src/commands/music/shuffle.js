const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class QueueMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shuffle',
      usage: 'shuffle',
      description: 'Shuffles songs you have added',
      type: client.types.MUSIC
    });
  }
  async run(message) {
    }
  };
