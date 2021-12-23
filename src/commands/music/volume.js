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
  async run (message, args) {
      let queue = message.client.queue()
      let serverQueue = queue.get(message.guild.id)

      if (!serverQueue) return this.sendErrorMessage(message, 1, 'There is nothing playing.');
      if (!args[0]) {
          return message.channel.send(`🔊 The current volume is: **${serverQueue.volume * 100}%**`)
      }

      let volume = parseInt(args[0])
      if (isNaN(volume)) return this.sendErrorMessage(message, 0, 'Please specify a valid volume.');
      // Volume must be between or equal to 1 and 200
      if (volume < 1 || volume > 200) return this.sendErrorMessage(message, 0, 'Please specify a value between 1 and 200.');

      serverQueue.volume = volume
      serverQueue.connection.dispatcher.setVolumeLogarithmic(volume / 100)

      return message.channel.send(`🔊 Volume set to **${volume}%**`)
  }
  }
