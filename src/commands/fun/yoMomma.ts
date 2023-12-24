import axios from 'axios';
import { CommandTypes, CommandOptions, CommandsErrorTypes } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';
var translate = require('node-google-translate-skidz');

let command: CommandOptions = {
    name: 'yomomma',
    type: CommandTypes.Fun,
    aliases: ['yourmom', 'yomamma', 'yomama', 'ym'],
    usage: 'yomomma [user mention/ID]',
    examples: ['yomomma @user'],
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("yomomma") || client.language.get("en")?.get("yomomma");

        const member = await client.utils.getMemberFromMentionOrID(message, args[0]) ||
            message.member;

        try {
            const res = await axios.get('https://api.yomomma.info')
                .then((res) => res.data)
                .catch((err) => undefined)
            if (!res) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.tryLater, lang.errors.APIDown);

            let joke = res.joke;
            joke = joke.charAt(0).toLowerCase() + joke.slice(1);
            if (!joke.endsWith('!') && !joke.endsWith('.') && !joke.endsWith('"')) joke += '!';
            const embed = new EmbedBuilder()
                .setTitle(lang.embed.title)
                .setDescription(`${member}, ${joke}`)
                .setFooter({
                    text: message.author.username,
                    iconURL: message.author.displayAvatarURL()
                })
                .setTimestamp()
                .setColor(message.guild?.members?.me?.displayHexColor || message.member?.displayHexColor || "Random")

            if (language) {
                if (language !== "en") {
                    const translateResponse = await translate({
                        text: joke.replace("yo mamma", "your mother is"),
                        source: 'en',
                        target: language
                    });
                    embed.setDescription(`${member}, ${translateResponse.translation}`);
                } else {
                    //If the language is english, just display the original and translated version.
                    embed.setDescription(`${member}, ${joke}`);
                }
            } else embed.setDescription(`${member}, ${joke}`);
            message.channel.send({
                embeds: [embed]
            });
        } catch (err) {
            await client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.tryLater, lang.errors.APIDown);
        }
    }
}

export = command;