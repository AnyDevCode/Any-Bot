const Command = require('../Command.js');
const {MessageEmbed, MessageCollector} = require('discord.js');
const ytSearch = require('yt-search');

module.exports = class SearchMusicCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'search',
            usage: 'search <query>',
            aliases: ['ytsearch'],
            description: 'Searches Youtube for a provided query',
            examples: ['search Opinions CG5'],
            type: client.types.MUSIC,
        });
    }

    async run(message, args) {
        let query = args.join(' ');
        if (!query) return this.sendErrorMessage(message, 1, 'You must provide a query to search for.');

        const play_song = async (guild, song, queue) => message.client.utils.play_song(guild, song, queue);

        const video_finder = async (query) => {
            const video_result = await ytSearch(query);
            return (video_result.videos.length > 1) ? video_result : null;
        }

        const video_result = await video_finder(query);
        if (!video_result) return this.sendErrorMessage(message, 1, 'No results found for that query.');

        let embed = new MessageEmbed()
            .setAuthor(`${message.guild.name} Music Search`, message.guild.iconURL())
            .setColor(message.guild.me.displayHexColor)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())

        let description = '';
        for (let i = 0; i < video_result.videos.length; i++) {
            description += `${i + 1}. [${video_result.videos[i].title}](${video_result.videos[i].url}) - ${video_result.videos[i].author.name}\n`;
        }

        embed.setDescription(description);
        message.channel.send(embed);

        const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, {time: 30000});
        collector.on('collect', async m => {
            const response = parseInt(m.content);
            if (response < 0 || response >= video_result.videos.length) return collector.stop('invalid');
            collector.stop('valid');
            let queue = message.client.queue();

            const server_queue = queue.get(message.guild.id);
            const video = video_result.videos[response - 1];

            let voice_channel = message.member.voice.channel;

            const song = {
                title: video.title,
                url: video.url,
                duration: video.duration,
                thumbnail: video.thumbnail,
                requester: message.author.id,
                type: 'youtube'
            };
            if (!server_queue) {


                const queue_constructor = {
                    voice_channel: voice_channel,
                    text_channel: message.channel,
                    connection: null,
                    songs: [],
                    volume: 0.5,
                    playing: true,
                    loop: false,
                    channel: message.channel,
                }

                //Add our key and value pair into the global queue. We then use this to get our server queue.
                queue.set(message.guild.id, queue_constructor);
                queue_constructor.songs.push(song);

                //Establish a connection and play the song with the vide_player function.
                try {
                    queue_constructor.connection = await voice_channel.join();
                    play_song(message.guild, queue_constructor.songs[0], queue);
                } catch (err) {
                    queue.delete(message.guild.id);
                    this.sendErrorMessage(message, 1, 'There was an error connecting!');
                    throw err;
                }
            } else {
                server_queue.songs.push(song);
                return message.channel.send(`👍 **${song.title}** added to queue!`);
            }


        });
        collector.on('end', (_, reason) => {
            if (reason === 'invalid') return message.channel.send('Invalid response, try again.');
        });
    }
};
