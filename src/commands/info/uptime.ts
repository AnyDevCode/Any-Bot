import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';
import moment from 'moment';

let command: CommandOptions = {
    name: "uptime",
    aliases: ["up"],
    type: CommandTypes.Info,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("uptime") || client.language.get("en")?.get("uptime");
        const d = moment.duration(client.uptime || 0);
        const date = moment().subtract(d, 'ms').format('dddd, MMMM Do YYYY');
        const embed = new EmbedBuilder()
            .setTitle(lang.embed.title.replace(/%%BOT%%/g, message.client.user.username))
            .setColor("Random")
            .setTimestamp()
            .setFooter({
                text: message.guild?.name || message.author.username,
                iconURL: message.guild?.iconURL() || message.author.displayAvatarURL()
            })
            .setDescription(`<t:${Math.round((Date.now() - d.asMilliseconds())/1000)}:R>`)
            .addFields({
                name: lang.embed.fields[0].name,
                value: `<t:${Math.round((Date.now() - d.asMilliseconds())/1000)}:D>`

            });

        return message.reply({ embeds: [embed] });
    }
}

export = command;