const Command = require("../Command.js");
const { QueryType } = require('discord-player');

module.exports = class PlayMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: "play",
      usage: "play lofi music",
      aliases: ["pl"],
      description: "Plays music from youtube",
      examples: [
        "play lofi music",
        "play https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      ],
      userPermissions: ["CONNECT", "SPEAK"],
      type: client.types.MUSIC,
    });
  }
  async run(message, args, client, player) {
    const { channel } = message.member.voice;
    if (!channel)
      return message.reply(
        ":x: | I'm sorry but you need to be in a voice channel to play music!"
      );
    if (
      message.guild.me.voice.channelId &&
      channel.id !== message.guild.me.voice.channelId
    )
      return message.reply(
        ":x: | I'm sorry but you need to be in the same voice channel as the bot to play music!"
      );

    const query = args.join(" ") || (message.attachments.first() ? message.attachments.first().url : null);

    if (!query) return message.reply("Please provide a search term");

    const searchResult = await player
      .search(query, {
        requestedBy: message.author,
        searchEngine: QueryType.AUTO,
      })
      .catch(async () => {
        return this.sendErrorMessage(
          message,
          0,
          ":x: | I'm sorry but I could not find any results for that search term!"
        );
      });
    if (!searchResult || !searchResult.tracks.length)
      return  message.reply({ content: "No results were found!" });

    const queue = player.createQueue(message.guild, {
      ytdlOptions: {
        filter: "audioonly",
        highWaterMark: 1 << 30,
        dlChunkSize: 0,
      },
      metadata: {
        channel: message.channel,
      },
    });

    try {
      //If the bot is not in a voice channel
      if (!queue.connection) await queue.connect(message.member.voice.channel);
      if (!message.guild.me.voice.channel) {
        await message.guild.me.voice.channel.join();
        await player.deleteQueue(message.guild.id);
        //Reexecute the command
        return this.run(message, args, client, player);
      }
    } catch {
      await player.deleteQueue(message.guild.id);
      return message.reply({
        content: "Could not join your voice channel!",
      });
    }

    const track = await player
      .search(query, {
        requestedBy: message.user,
      })
      .then((x) => x.tracks[0]);
    if (!track)
      return message.reply({
        content: `❌ | Track **${query}** not found!`,
      });

      await message.reply({ content: `⏱ | Loading your ${searchResult.playlist ? 'playlist' : 'track'}...` });
      searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
      if (!queue.playing) await queue.play();
  }
};
