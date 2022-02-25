const Command = require('../Command.js');

module.exports = class StopMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'stop',
      usage: 'stop',
      aliases: ['stopsong', 'stopsongs'],
      description: 'Stops all songs and clears the queue.',
      type: client.types.MUSIC,
    });
  }
  async run(message, args, client, player) {
    const queue = player.createQueue(message.guild, {
      metadata: {
        channel: message.channel,
      },
    });
    if(!queue || !queue.playing) return message.reply(`❌ | There is nothing playing.`);
    queue.destroy();
    return message.reply('🔇 | Stopped all songs and cleared the queue.');
  }
  };
