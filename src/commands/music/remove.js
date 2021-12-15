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
      type: client.types.MUSIC,
      disabled: true
    });
  }
  async run(message) {
    }
  };
