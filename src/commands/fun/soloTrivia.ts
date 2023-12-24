import { CommandTypes, CommandOptions, CommandsErrorTypes, TopicData } from '../../utils/utils';
import { EmbedBuilder, MessageCollector, User, Message } from 'discord.js';
import YAML from 'yaml';
import fs from 'fs';

const command: CommandOptions = {
    name: 'solotrivia',
    usage: 'solotrivia [topic]',
    aliases: ['solotriv', 'striv', 'solot', 'st'],
    type: CommandTypes.Fun,
    examples: ['solotrivia sports'],
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("solotrivia") || client.language.get("en")?.get("solotrivia");

        const prefix = (await client.database.settings.selectPrefix(message.guild?.id)) || client.prefix;
        let topic: string = args[0]?.toLowerCase() || '';

        if (!topic) {
            // Pick a random topic if none given
            const topics = client.topicsCollection.get(language) || [];
            if (!topics.length) return message.reply({ content: lang?.errors?.noTopics });
            topic = topics[Math.floor(Math.random() * topics.length)];
        } else if (!client.topicsCollection.get(language)?.includes(topic)) {
            return client.utils.sendErrorEmbed(
                client,
                language,
                message,
                this,
                CommandsErrorTypes.InvalidArgument,
                lang?.errors?.noValidTopic?.replace("%%PREFIX%%", prefix)
            );
        }

        // Get question and answers
        const path = `./data/trivia/${language}/${topic}.yml`;
        const { questions }: TopicData = YAML.parse(fs.readFileSync(path, 'utf-8'));
        const n = Math.floor(Math.random() * questions.length);
        const { question, answers } = questions[n];
        const origAnswers = answers.map(a => `\`${a}\``);

        // Clean answers
        const cleanedAnswers = answers.map(a => a.trim().toLowerCase().replace(/\.|'|-|\s/g, ''));

        // Get user answer
        const questionEmbed = new EmbedBuilder()
            .setTitle(lang?.embed?.title)
            .addFields({
                name: lang?.embed?.fields[0]?.name,
                value: `\`${topic}\``
            }, {
                name: lang?.embed?.fields[1]?.name,
                value: `${question}`
            })
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setTimestamp()
            .setColor(message.guild?.members.me?.displayHexColor || client.user?.hexAccentColor || message.author.hexAccentColor || "Random");

        const url = question.match(/\bhttps?:\/\/\S+/gi);
        if (url) questionEmbed.setImage(url[0]);

        message.channel.send({ embeds: [questionEmbed] });

        let winner: User;
        const collector = new MessageCollector(message.channel, {
            time: 30000,
            filter: (msg: Message) => !msg.author.bot && msg.author === message.author
        });

        collector.on('collect', msg => {
            const cleanedContent = msg.content.trim().toLowerCase().replace(/\.|'|-|\s/g, '');
            if (cleanedAnswers.includes(cleanedContent)) {
                winner = msg.author;
                collector.stop();
            }
        });

        collector.on('end', () => {
            const answerEmbed = new EmbedBuilder()
                .setTitle(lang?.embed?.title)
                .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setTimestamp()
                .setColor(message.guild?.members.me?.displayHexColor || client.user?.hexAccentColor || message.author.hexAccentColor || "Random");

            if (winner) message.channel.send({ embeds: [answerEmbed.setDescription(lang?.messages?.win?.replace("%%WINNER%%", winner))] });
            else message.channel.send({
                embeds: [answerEmbed.setDescription(lang?.messages?.lose?.replace("%%AUTHOR%%", message.author))
                    .addFields({
                        name: lang?.embed?.fields[2]?.name,
                        value: origAnswers.join('\n')
                    })]
            });

        });
    }
};

export = command;
