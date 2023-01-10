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
        const days = (d.days() === 1) ? d.days() + " " + lang.day : d.days() + " " + lang.days;
        const hours = (d.hours() === 1) ? d.hours() + " " + lang.hour : d.hours() + " " + lang.hours;
        const minutes = (d.minutes() === 1) ? d.minutes() + " " + lang.minute : d.minutes() + " " + lang.minutes;
        const seconds = (d.seconds() === 1) ? d.seconds() + " " + lang.second : d.seconds() + " " + lang.seconds;
        const date = moment().subtract(d, 'ms').format('dddd, MMMM Do YYYY');
        const embed = new EmbedBuilder()
            .setTitle(lang.embed.title.replace("%%BOT%%", message.client.user.username))
            .setColor("Random")
            .setTimestamp()
            .setFooter({
                text: message.guild?.name || message.author.username,
                iconURL: message.guild?.iconURL() || message.author.displayAvatarURL()
            })
            .setDescription(lang.embed.description.replace("%%DAYS%%", days).replace("%%HOURS%%", hours).replace("%%MINUTES%%", minutes).replace("%%SECONDS%%", seconds))
            .addFields({
                name: lang.embed.fields[0].name,
                value: date
            });

        return message.channel.send({ embeds: [embed] });
    }
}

export = command;