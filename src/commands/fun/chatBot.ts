import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';
var translate = require('node-google-translate-skidz');

let command: CommandOptions = {
    name: "chatbot",
    type: CommandTypes.Fun,
    aliases: ['chb', 'cbot', 'brain'],
    examples: ["chatbot Is this a good bot?", "chatbot What is your name?"],
    usage: "chatbot [question]",
    cooldown: 10,
    premiumCooldown: 5,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("chatbot") || client.language.get("en")?.get("chatbot");

        if (!args[0]) return message.channel.send(lang.errors.noArgs);
        const question = args.join(" ");

        const translateQuestion = await translate({
            text: question,
            source: 'auto',
            target: 'en'
        });

        const response = await client.utils.chatBot(translateQuestion.translation, client, message);

        let embed = new EmbedBuilder()
            .setTitle(lang.embed.title)
            .setFooter({
                text: message.author.tag,
                iconURL: message.author.displayAvatarURL(),
            })
            .setTimestamp()
            .setColor(message.guild?.members.me?.displayColor || "Random")

        if (translateQuestion.src !== "en") {
            const translateResponse = await translate({
                text: response,
                source: 'en',
                target: translateQuestion.src
            });

            embed.setDescription(translateResponse.translation);

        } else embed.setDescription(response)

        return message.channel.send({ embeds: [embed] });
    }
}

export = command;