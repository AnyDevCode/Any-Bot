const Command = require("../Command.js");
const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

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
  async run(message, args) {
    //Functions
    const play_song = async (guild, song, queue) =>
      message.client.utils.play_song(guild, song, queue);
    const update_server_queue = async (message, server_queue, queue) =>
      message.client.utils.update_server_queue(message, server_queue, queue);
    const force_stop_song = async (message, song_queue, queue) =>
      message.client.utils.force_stop_song(message, song_queue, queue);

    //Get the queue
    let queue = message.client.queue();
    let serverQueue = queue.get(message.guild.id);

    // Check if bot is not buggy
    if (typeof message.guild.voice != "undefined") {
      if (
        typeof message.guild.voice.channelID == "object" &&
        queue.get(message.guild.id)
      ) {
        let server_queue = queue.get(message.guild.id);
        server_queue.connection = await message.member.voice.channel.join();
        await update_server_queue(message, server_queue, queue);
        //Kick users the user of voice channel
        await force_stop_song(message, server_queue);
        // await 1 seconds
        await new Promise((resolve) => setTimeout(resolve, 1000));
        //Execute the command
        return message.client.commands.get("play").run(message, args);
      }
    }

    //Check the channel
    const { channel } = message.member.voice;
    let voice_channel = channel.channel;
    if (!channel)
      return message.reply(
        ":x: | I'm sorry but you need to be in a voice channel to play music!"
      );

    //Check if the the user is in the same voice channel
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(
        ":x: | I'm sorry but you need to be in the same voice channel as the bot to play music!"
      );

    //Get prefix
    const prefix = message.client.db.settings.selectPrefix
      .pluck()
      .get(message.guild.id);

    //Check if have args
    if (!args.length && !message.attachments.size)
      return this.sendErrorMessage(
        message,
        0,
        `Usage: ${prefix}play [YouTube URL | Video Name | File URL]`
      );

    //React the message and If the user reacted, remove the reaction
    await message.react("🎶");

    //Check if the bot have the permissions to join the voice channel
    if (!channel.permissionsFor(message.client.user).has("CONNECT"))
      return message.reply(
        ":x: | I'm sorry but I don't have the permissions to join the voice channel!"
      );

    //Check if the bot have the permissions to speak in the voice channel
    if (!channel.permissionsFor(message.client.user).has("SPEAK"))
      return message.reply(
        ":x: | I'm sorry but I don't have the permissions to speak in the voice channel!"
      );

    //Define some url patterns
    const search = args.join(" ");
    const videoPattern =
      /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const urlValid = videoPattern.test(args[0]);

    //Make queue constructor
    const queue_constructor = {
      voice_channel: channel,
      text_channel: message.channel,
      connection: null,
      songs: [],
      volume: 0.5,
      playing: true,
      loop_queue: false,
      channel: message.channel,
      realseek: 0,
      filters: [],
    };

    //Info of song
    let song = {};

    if (message.attachments.size) {
      song.url = message.attachments.first().url;
      song.title = message.attachments.first().name;
      song.type = "attachment";
      song.requester = message.author.id;
      song.duration = "Unknown";
      song.seconds = 0;
      song.thumbnail =
        "https://media.discordapp.net/attachments/779357529859686441/923005881250091008/Any_Bot_404.png?width=480&height=480";
    } else {
      if (urlValid) {
        if (ytdl.validateURL(args[0])) {
          const song_info = await ytdl.getInfo(args[0]);
          let timestamp = parseInt(song_info.videoDetails.lengthSeconds);
          let minutes = Math.floor(timestamp / 60);
          let seconds = timestamp - minutes * 60;
          if (seconds < 10) seconds = "0" + seconds;
          let duration = `${minutes}:${seconds}`;
          song = {
            title: song_info.videoDetails.title,
            url: song_info.videoDetails.video_url,
            type: "youtube",
            requester: message.author.id,
            duration: duration,
            seconds: timestamp,
            thumbnail: song_info.videoDetails.thumbnails[0].url,
          };
        } else {
          //If there was no link, we use keywords to search for a video. Set the song object to have two keys. Title and URl.
          const video_finder = async (query) => {
            const video_result = await ytSearch(query);
            return video_result.videos.length > 1
              ? video_result.videos[0]
              : null;
          };

          const video = await video_finder(search);
          if (video) {
            song = {
              title: video.title,
              url: video.url,
              type: "youtube",
              requester: message.author.id,
              duration: video.duration.timestamp,
              seconds: video.duration.timestamp,
              thumbnail: video.thumbnail,
            };
          } else {
            message.channel.send(":x: | No results found.");
          }
        }
      } else if (
        args[0].includes("discordapp.com/attachments") &&
        args[0].includes(
          "mp3" ||
            "wav" ||
            "flac" ||
            "ogg" ||
            "opus" ||
            "aac" ||
            "m4a" ||
            "mp4" ||
            "webm"
        )
      ) {
        song = {
          url: args[0],
          title: args[0].split("/").pop(),
          type: "attachment",
          requester: message.author.id,
          duration: "Unknown",
          seconds: 0,
          thumbnail:
            "https://media.discordapp.net/attachments/779357529859686441/923005881250091008/Any_Bot_404.png?width=480&height=480",
        };
      } else {
        if (
          args[0].includes(".mp3") ||
          args[0].includes(".wav") ||
          args[0].includes(".flac") ||
          args[0].includes(".ogg") ||
          args[0].includes(".opus") ||
          args[0].includes(".aac") ||
          args[0].includes(".m4a") ||
          args[0].includes(".mp4") ||
          args[0].includes(".webm")
        ) {
          song = {
            url: args[0],
            title: args[0].split("/").pop(),
            type: "attachment",
            requester: message.author.id,
            duration: "Unknown",
            seconds: 0,
            thumbnail:
              "https://media.discordapp.net/attachments/779357529859686441/923005881250091008/Any_Bot_404.png?width=480&height=480",
          };
        } else {
          const video_finder = async (query) => {
            const video_result = await ytSearch(query);
            return video_result.videos.length > 1
              ? video_result.videos[0]
              : null;
          };

          const video = await video_finder(search);
          if (video) {
            song = {
              title: video.title,
              url: video.url,
              type: "youtube",
              requester: message.author.id,
              duration: video.duration.timestamp,
              thumbnail: video.thumbnail,
            };
          } else {
            this.sendErrorMessage(message, 0, "Error finding video.");
          }
        }
      }

      //If the first argument is a link. Set the song object to have two keys. Title and URl.
    }
    //If the server queue does not exist (which doesn't for the first video queued) then create a constructor to be added to our global queue.
    if (!serverQueue) {
      //Add our key and value pair into the global queue. We then use this to get our server queue.
      queue.set(message.guild.id, queue_constructor);
      queue_constructor.songs.push(song);

      //Establish a connection and play the song with the vide_player function.
      try {
        queue_constructor.connection = await channel.join();
        await queue_constructor.connection.voice.setSelfDeaf(true);
        await queue_constructor.connection.voice.setDeaf(true);
        await play_song(message.guild, queue_constructor.songs[0], queue);
      } catch (err) {
        queue.delete(message.guild.id);
        this.sendErrorMessage(message, 1, "There was an error connecting!");
        throw err;
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`👍 **${song.title}** added to queue!`);
    }
  }
};
