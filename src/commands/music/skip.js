const Command = require('../Command.js');

module.exports = class QueueMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      usage: 'skip',
      aliases: ['voteskip'],
      description: 'Votes to skip the current song',
      type: client.types.MUSIC,
    });
  }
  async run(message, args, client, player) {
    const queue = player.getQueue(message.guild.id);
    if(!queue || !queue.playing) return message.reply(`❌ | There is nothing playing.`);
    const currentTrack = queue.current;
    const success = queue.skip();
    await message.reply({
      content: success ? `✅ | Skip **${currentTrack}**!` : `❌ | Failed to skip`,
    });
  }

  };
