const Command = require("../Command.js");

module.exports = class JumpMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: "jump",
      usage: "jump <position>",
      description: "Jumps to a specified position in the queue",
      type: client.types.MUSIC,
    });
  }
  async run(message, args, client, player) {
    const queue = player.getQueue(message.guild.id);
    if (!queue || !queue.playing)
      return message.reply(`❌ | There is nothing playing.`);

    if (!args[0]) return message.reply(`❌ | You must specify a position to jump to.`);
    if (isNaN(args[0])) return message.reply(`❌ | You must specify a valid position to jump to.`);
    if ((args[0] > queue.tracks.length) || (parseInt(args[0])<1)) return message.reply(`❌ | You must specify a valid position to jump to.`);

    const trackIndex = parseInt(args[0]) - 1;
    const trackName = queue.tracks[trackIndex].title;
    queue.jump(trackIndex);
    
    await await message.reply({content: `⏭ | **${trackName}** has jumped the queue!`})
  }
}

