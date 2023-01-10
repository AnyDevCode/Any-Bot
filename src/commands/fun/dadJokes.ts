import { CommandTypes, CommandOptions, CommandsErrorTypes } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';
import axios from 'axios';
var translate = require('node-google-translate-skidz');

let command: CommandOptions = {
    name: "dadjokes",
    type: CommandTypes.Fun,
    aliases: ['dadjk', 'dadjoke'],
    usage: 'dadjokes',
    cooldown: 10,
    premiumCooldown: 5,
    async run(message, args, client, language) {

        const lang = client.language.get(language || "en")?.get("dadjokes") || client.language.get("en")?.get("dadjokes");
        try {
            const res = await axios
                .get('https://icanhazdadjoke.com/', {
                    headers: {
                        "User-Agent": "Any Bot (https://github.com/MDCYT/Any-Bot)",
                        "Accept": "application/json"
                    }
                })
                .then((res) => res.data)
                .catch((err) => {
                    client.logger.error(err.stack);
                    return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.api, lang.errors.apiDesc);
                });
            const embed = new EmbedBuilder()
                .setTitle(lang.embed.title)
                .setFooter({
                    text: message.member?.displayName || message.author.username,
                    iconURL: message.author.displayAvatarURL(),
                })
                .setTimestamp()
                .setColor(message.guild?.members.me?.displayHexColor || 'Random');

            if (language) {
                if (language !== "en") {
                    const translateResponse = await translate({
                        text: res.joke,
                        source: 'en',
                        target: language
                    });
                    embed.setDescription(lang.embed.description.replace("%%ORIGINAL_JOKE%%", res.joke).replace("%%TRANSLATED_JOKE%%", translateResponse.translation));
                }
            } else embed.setDescription(res.joke);

            message.channel.send({
                embeds: [embed]
            });

        } catch (err) {
            return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.api, lang.errors.apiDesc);
        }
    }
}

export = command;