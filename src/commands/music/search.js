const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class SearchMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'search',
      usage: 'search <query>',
      aliases: ['ytsearch'],
      description: 'Searches Youtube for a provided query',
	  examples: ['search Opinions CG5'],
      type: client.types.MUSIC,
      disabled: true
    });
  }
  async run(message) {
    }
  };
