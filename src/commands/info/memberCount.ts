import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';

let command: CommandOptions = {
    name: "membercount",
    type: CommandTypes.Info,
    aliases: ["members", "mc"],
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("membercount") || client.language.get("en")?.get("membercount");
        const guild = message.guild || await client.guilds.fetch(message.guildId || "");
        const members = await guild.members.fetch();
        const embed = new EmbedBuilder()
            .setTitle(lang?.embed?.title)
            .setColor(client.user?.hexAccentColor || message.author.hexAccentColor || "Random")
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp()
            .setDescription(lang?.embed?.description.replace(/%%MEMBERS%%/g, members.size.toString()).replace(/%%HUMANS%%/g, members.filter(m => !m.user.bot).size.toString()).replace(/%%BOTS%%/g, members.filter(m => m.user.bot).size.toString()))

        return message.channel.send({ embeds: [embed] })
    }
}

export = command;