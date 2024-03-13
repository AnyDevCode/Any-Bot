import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';

let command: CommandOptions = {
    name: "8ball",
    type: CommandTypes.Fun,
    aliases: ["8b", "eightball"],
    examples: ["8ball Is this a good bot?"],
    usage: "8ball [question]",
    cooldown: 5,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("8ball") || client.language.get("en")?.get("8ball");

        if (!args[0]) return message.channel.send(lang.noArgs);
        const answers = lang.answers;
        const answer = answers[Math.floor(Math.random() * answers.length)];
        const embed = new EmbedBuilder()
            .setTitle(lang.title)
            .setColor(client.user?.hexAccentColor || message.author.hexAccentColor || message.guild?.members.cache.get(client.user?.id as string)?.roles.color?.color || "Random")
            .setFooter({
                text: lang.disclaimer.replace(/%%USER%%/g, message.author.username),
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp()
            .setDescription(lang.descriptionembed.replace(/%%ANSWER%%/g, answer).replace(/%%QUESTION%%/g, args.join(" ")))

        return message.channel.send({ embeds: [embed] })
    }
}

export = command;