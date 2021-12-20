const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class PlayMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'play',
      usage: 'play <title|URL|subcommand>',
      description: 'Plays the provided song',
      examples: ['play NCS 1 Hour', 'play https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'play [file]'],
      type: client.types.MUSIC
    });
  }
  async run(message) {
    console.log(message.content);
    message.attachments.forEach(async attachment => {
      // do something with the attachment
      if (message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();
        // LET IT RIP, BABY!

        const url = attachment.url;
        
        const dispatcher = connection.play(url);

      } else {
        message.reply('You need to join a voice channel first!');
      }
    
      });
    }
  };
