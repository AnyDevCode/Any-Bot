const Command = require("../Command.js");

module.exports = class PauseMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: "pause",
      usage: "pause",
      description: "Pauses the music",
      type: client.types.MUSIC,
    });
  }
  async run(message, args, client, player) {
    const queue = player.getQueue(message.guild.id);
    if (!queue || !queue.playing)
      return message.reply(`❌ | There is nothing playing.`);

    const paused = queue.setPaused(true);
    message.reply({
      content: paused ? "⏸ | Paused!" : "❌ | Something went wrong!",
    });
  }
};
