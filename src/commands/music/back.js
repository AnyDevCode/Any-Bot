const Command = require('../Command.js');

module.exports = class BackMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'back',
      usage: 'back',
      description: 'Play the previous track',
      type: client.types.MUSIC,
    });
  }
  async run(message, args, client, player) {
    const queue = player.getQueue(message.guild.id);
    if(!queue || !queue.playing) return message.reply(`❌ | There is nothing playing.`);

    try{
      success = await queue.back();
    }catch(e){
      return message.reply(`❌ | There is nothing to go back to.`);
    }

    return message.reply({
      content: `✅ | Backed to the previous track.`
    });

  }

  };
