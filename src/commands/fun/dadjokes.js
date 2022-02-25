const Command = require('../Command.js');

module.exports = class DadJokesCommand extends Command {
  constructor(client) {
      super(client, {
          name: 'dadjokes',
          aliases: ['dadjk'],
          description: 'Tells you a dad joke.',
          type: client.types.FUN
      });
  }

    async run(message) {
        require('node-fetch')('https://icanhazdadjoke.com/slack')
            .then(res => res.json())
            .then(d => message.channel.send({content: d.attachments[0].text}));
    }
};
