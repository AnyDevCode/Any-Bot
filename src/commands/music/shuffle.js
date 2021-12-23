const Command = require('../Command.js');

module.exports = class QueueMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shuffle',
      usage: 'shuffle',
      description: 'Shuffles songs you have added',
      type: client.types.MUSIC,
    });
  }
  async run(message) {

    let queue = message.client.queue();

    let server_queue = queue.get(message.guild.id);

    if (!server_queue) return this.sendErrorMessage(message, 0, 'There is nothing playing that I could shuffle.');

    if (server_queue.songs.length < 2) return this.sendErrorMessage(message, 0, 'I cannot shuffle a queue of length 1');

    let songs = server_queue.songs;

    for (let i = songs.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [songs[i], songs[j]] = [songs[j], songs[i]];
      }

    server_queue.songs = songs;

    return message.channel.send('Shuffled the queue!');
    }
  };
