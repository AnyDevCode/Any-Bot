const Command = require("../Command.js");

module.exports = class ResumeMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: "resume",
      usage: "resume",
      description: "Resumes the music",
      type: client.types.MUSIC,
    });
  }
  async run(message, args, client, player) {
    const queue = player.getQueue(message.guild.id);
    if (!queue || !queue.playing)
      return message.reply(`❌ | There is nothing playing.`);

    const paused = queue.setPaused(false);
    await message.reply({
      content: paused ? "⏯ | Resumed!" : "❌ | Something went wrong!",
    });
  }
};
