import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';

let command: CommandOptions = {
    name: "topics",
    type: CommandTypes.Fun,
    aliases: ['triviatopics', 'categories', 'ts'],
    usage: 'topics',
    async run(message, args, client, language) {

        const lang = client.language.get(language || "en")?.get("topics") || client.language.get("en")?.get("topics");

        const prefix = await client.database.settings.selectPrefix(message.guild?.id) || client.prefix
        const topics: string[] = [];
        const allTopics = client.topicsCollection.get(language) || []
        allTopics.forEach(topic => {
            topics.push(`\`${topic}\``);
        });

        const embed = new EmbedBuilder()
            .setTitle(lang?.embed?.title)
            .setDescription(lang?.embed?.description?.replace("%%TOPICS%%", topics.join(' ')).replace("%%PREFIX%%", prefix))
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setTimestamp()
            .setColor(message.guild?.members.me?.displayHexColor || message.member?.displayHexColor || "Random")
        message.reply({ embeds: [embed] });
    }
}

export = command;