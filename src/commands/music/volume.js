const Command = require('../Command.js');

module.exports = class VolumeMusicCommand extends Command {
  constructor(client) {
    super(client, {
        name: 'volume',
        usage: "volume <volume>",
        aliases: ["vol"],
        description: 'Changes the volume of the music player.',
        examples: ['volume 50', 'volume 10'],
        type: client.types.MUSIC,
      });
  }
  async run (message, args, client, player) {
    const queue = player.getQueue(message.guild.id);
    if(!queue || !queue.playing) return message.reply(`❌ | There is nothing playing.`);
    if (!args[0]) return message.reply(`🔊 | The current volume is ${queue.volume}%`);
    if(isNaN(args[0])) return message.reply('❌ | Please provide a valid number');
    let volume = parseInt(args[0]);

    if (args[0] > 200 || args[0] < 0) return message.reply('❌ | Please specify a volume between 0 and 200');
    
    const success = await queue.setVolume(volume);
    return message.reply({
      content: success ? `🔊 | The volume has been set to ${volume}%` : `🔊 | Failed to set the volume`,
    }
    );

  }
  }
