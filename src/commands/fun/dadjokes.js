const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const axios = require('axios')

module.exports = class DadJokesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'dadjokes',
      aliases: ['dadjk'],
      description: 'Tells you a dad joke.',
      type: client.types.FUN
    });
  }
  async run(message, args) {
	  require('node-fetch')('https://icanhazdadjoke.com/slack')
		.then(res => res.json()) //recogemos los resultados en un .json
		.then(d => message.channel.send(d.attachments[0].text)) //enviamos el primer elemento del json
  }
};
