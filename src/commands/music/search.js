const Command = require('../Command.js');
const {
    MessageEmbed,
    MessageCollector
} = require('discord.js');
const {
    QueryType
} = require('discord-player');
module.exports = class SearchMusicCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'search',
            usage: 'search <query>',
            aliases: ['search'],
            description: 'Searches Music for a provided query',
            examples: ['search Opinions CG5', 'search Never gonna give you up'],
            type: client.types.MUSIC,
            clientPermissions: ['CONNECT', 'SPEAK', 'SEND_MESSAGES', 'EMBED_LINKS'],
        });
    }

    async run(message, args, client, player) {
        const {
            channel
        } = message.member.voice;

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

        let query = args.join(' ');

        if (!query) return this.sendErrorMessage(message, 1, 'Please provide a search term');

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
        if (!searchResult || !searchResult.tracks.length) return message.reply({
            content: "No results were found!"
        });

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

        let embed = new MessageEmbed()
            .setAuthor({
                name: `${message.guild.name} Music Search`,
                iconURL: message.guild.iconURL()
            })
            .setColor(message.guild.me.displayHexColor)
            .setFooter({
                text: `Requested by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL()
            })

        let description = '';
        for (let i = 0; i < searchResult.tracks.length; i++) {
            description += `${i + 1}. [${searchResult.tracks[i].title}](${searchResult.tracks[i].url}) - ${searchResult.tracks[i].author}\n`;
        }

        embed.setDescription(description);
        await message.channel.send({
            embeds: [embed]
        });

        const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, {
            time: 30000
        });

        collector.on('collect', async m => {
            const response = parseInt(m.content);
            if (response < 0 || response >= searchResult.tracks.length) return collector.stop('invalid');
            collector.stop('valid');

            const video = searchResult.tracks[response - 1];

            await message.reply({
                content: `⏱ | Loading your track...`
            });

            queue.addTrack(video);

            if (!queue.playing) await queue.play();
        });
        collector.on('end', (_, reason) => {
            if (reason === 'invalid') return message.channel.send('Invalid response, try again.');
        });
    }
};
