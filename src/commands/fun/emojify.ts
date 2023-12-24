import { CommandTypes, CommandOptions, CommandsErrorTypes } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';

const numberMap = {
    '0': ':zero:',
    '1': ':one:',
    '2': ':two:',
    '3': ':three:',
    '4': ':four:',
    '5': ':five:',
    '6': ':six:',
    '7': ':seven:',
    '8': ':eight:',
    '9': ':nine:'
};

let command: CommandOptions = {
    name: "emojify",
    type: CommandTypes.Fun,
    aliases: ["sayemoji"],
    usage: "emojify [message]",
    examples: ["emojify Hello World!"],
    cooldown: 5,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("emojify") || client.language.get("en")?.get("emojify");

        if (!args[0]) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.InvalidArgument, lang.errors.noArgs);

        let msg = message.content.slice(message.content.indexOf(args[0]), message.content.length);
        msg = msg.split('').map(c => {
            if (typeof c !== 'string') c = String(c);
            if (c === ' ') return c;
            /* @ts-ignore */
            else if (/[0-9]/.test(c)) return numberMap[c];
            else return (/[a-zA-Z]/.test(c)) ? ':regional_indicator_' + c.toLowerCase() + ':' : '';
        }).join('');

        if (msg.length > 2048) {
            msg = msg.slice(0, msg.length - (msg.length - 2033));
            msg = msg.slice(0, msg.lastIndexOf(':')) + '**...**';
        }

        const embed = new EmbedBuilder()
            .setTitle(lang.embed.title)
            .setDescription(msg)
            .setFooter(
                {
                    text: message.author.username,
                    iconURL: message.author.displayAvatarURL(),
                }
            )
            .setTimestamp()
            .setColor(message.guild?.members.me?.displayHexColor || 'Random');
        message.channel.send({ embeds: [embed] });
    }
}

export = command;