import { CommandTypes, CommandOptions, CommandsErrorTypes } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';
import axios from 'axios';
var translate = require('node-google-translate-skidz');

let command: CommandOptions = {
    name: "thouart",
    type: CommandTypes.Fun,
    aliases: ['elizabethan', 'ta'],
    usage: 'thouart <user mention/ID>',
    cooldown: 10,
    premiumCooldown: 5,
    async run(message, args, client, language) {

        const lang = client.language.get(language || "en")?.get("thouart") || client.language.get("en")?.get("thouart");
        const member = await client.utils.getMemberFromMentionOrID(message, args[0]) || message.member;
        try {
            const res = await axios
                .get('https://quandyfactory.com/insult/json/', {
                    headers: {
                        "User-Agent": "Any Bot (https://github.com/MDCYT/Any-Bot)",
                        "Accept": "application/json"
                    }
                })
                .then((res) => res.data)
                .catch((err) => {
                    client.logger.error(err.stack);
                    return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang?.errors?.api, lang?.errors?.apiDesc);
                });
            const embed = new EmbedBuilder()
                .setTitle(lang?.embed?.title)
                .setFooter({
                    text: message.author.username,
                    iconURL: message.author.displayAvatarURL(),
                })
                .setTimestamp()
                .setColor(message.guild?.members.me?.displayHexColor || 'Random');

            if (language) {
                if (language !== "en") {
                    const translateResponse = await translate({
                        text: res.insult,
                        source: 'en',
                        target: language
                    });
                    embed.setDescription(lang?.embed?.description?.replace(/%%MEMBER%%/g, member).replace(/%%INSULT%%/g, translateResponse.translation));
                } else {
                    //If the language is english, just display the original and translated version.
                    embed.setDescription(lang?.embed?.description?.replace(/%%MEMBER%%/g, member).replace(/%%INSULT%%/g, res.insult));
                }
            } else embed.setDescription(lang?.embed?.description?.replace(/%%MEMBER%%/g, member).replace(/%%INSULT%%/g, res.insult));


            message.reply({
                embeds: [embed]
            });

        } catch (err) {
            return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.api, lang.errors.apiDesc);
        }
    }
}

export = command;