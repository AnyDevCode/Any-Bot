import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';

let command: CommandOptions = {
    name: "coinflip",
    type: CommandTypes.Fun,
    aliases: ['cointoss', 'coin', 'flip'],
    usage: "8ball",
    cooldown: 0,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("coinflip") || client.language.get("en")?.get("coinflip");

        let result = lang.tails;
        if (Math.floor(Math.random() * 2) === 0) result = lang.heads;
        const embed = new EmbedBuilder()
            .setTitle(lang.embed.title)
            .setDescription(lang.embed.description.replace("%%RESULT%%", result).replace("%%AUTHOR%%", message.member))
            .setFooter({
                text: message.member?.displayName || message.author.username,
                iconURL: message.author.displayAvatarURL(),
            })
            .setTimestamp()
            .setColor(message.guild?.members.me?.displayHexColor || 'Random');
        message.channel.send({ embeds: [embed] });
    },
}

export = command;
