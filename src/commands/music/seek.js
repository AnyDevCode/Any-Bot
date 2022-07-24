const Command = require("../Command.js");

module.exports = class SeekusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: "seek",
      usage: "seek <seconds>",
      aliases: ["seekus"],
      description: "Seek to a specific time in the current song",
      examples: ["seek 10", "seek 30"],
      type: client.types.MUSIC,
    });
  }
  async run(message, args, client, player) {
    const queue = player.getQueue(message.guild.id);
    if (!queue || !queue.playing)
      return message.reply(`❌ | There is nothing playing.`);
    let time = args[0];
    if (!time) return message.reply(`❌ | Please provide a valid time.`);
    if (isNaN(time)) return message.reply(`❌ | Please provide a valid time.`);
    time = parseInt(time) * 1000;

    const success = await queue.seek(time);

    return message.reply({
      content: success ? `✅ | Seeked to ${time/1000} seconds.` : `❌ | Failed to seek`,
    });
  }
};
