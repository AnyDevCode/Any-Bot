import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';

let command: CommandOptions = {
    name: "ping",
    type: CommandTypes.Info,
    aliases: ["pong"],
    cooldown: 5,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("ping") || client.language.get("en")?.get("ping");

        const msg = await message.channel.send(lang?.firstMessage);

        const latency = `\`\`\`ini\n[ ${Math.floor(msg.createdAt.getTime() - message.createdAt.getTime())}ms ]\`\`\``;
        const apiLatency = `\`\`\`ini\n[ ${Math.round(message.client.ws.ping)}ms ]\`\`\``

        const embed = new EmbedBuilder()
            .setTitle(lang?.secondMessage)
            .setColor(client.user?.hexAccentColor || message.author.hexAccentColor || message.guild?.members.cache.get(client.user?.id as string)?.roles.color?.color || "Random") 
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp()
            .addFields({
                name: lang?.fields[0],
                value: latency,
                inline: true
            }, {
                name: lang?.fields[1],
                value: apiLatency,
                inline: true
            })

        return msg.edit({ embeds: [embed], content: "Pong!"})
    }
}



export = command;