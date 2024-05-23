import { CommandTypes, CommandOptions, CommandsErrorTypes } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';

let command: CommandOptions = {
    name: "roll",
    type: CommandTypes.Fun,
    aliases: ['dice', 'r'],
    usage: 'roll <dice sides>',
    examples: ['roll 20', 'roll'],
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("roll") || client.language.get("en")?.get("roll");

        let limit = parseInt(args[0]) || 6;
        const n = Math.floor(Math.random() * limit + 1);
        if (!n || limit <= 0)
            return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.invalidNumber);
        const embed = new EmbedBuilder()
            .setTitle(lang.embed.title)
            .setDescription(lang.embed.description.replace(/%%AUTHOR%%/g, message.author).replace(/%%NUMBER%%/g, n))
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp()
            .setColor(message.guild?.members.me?.displayHexColor || 'Random');
        message.reply({ embeds: [embed] });
    }
}

export = command;