const Command = require("../Command.js");

module.exports = class QueueMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: "shuffle",
      usage: "shuffle",
      description: "Shuffles songs you have added",
      type: client.types.MUSIC,
    });
  }
  async run(message, args, client, player) {
    const queue = player.getQueue(message.guild.id);
    if (!queue || !queue.playing)
      return message.reply(`❌ | There is nothing playing.`);

    queue.shuffle();

    return message.reply("🔀 | Songs have been shuffled!");
  }
};
