const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class RemoveMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'remove',
      usage: 'remove <position>',
      aliases: ['delete'],
      description: 'Removes a song from the queue',
	  examples: ['remove 3'],
      type: client.types.MUSIC,
    });
  }
  async run(message, args, client, player) {

    const queue = player.getQueue(message.guild.id);
    if(!queue || !queue.playing) return message.reply(`❌ | There is nothing playing.`);

    if(!args[0]) return message.reply(`❌ | You must specify a position to remove.`);
    if(isNaN(args[0])) return message.reply(`❌ | You must specify a valid position to remove.`);
    if((args[0] > queue.tracks.length) || (parseInt(args[0])<1)) return message.reply(`❌ | You must specify a valid position to remove.`);

    let trackIndex  = parseInt(args[0]) - 1;
    let trackName = queue.tracks[trackIndex].title;

    queue.remove(trackIndex);

    return message.reply(`✅ | Removed **${trackName}** from the queue.`);

    

  }
  };
