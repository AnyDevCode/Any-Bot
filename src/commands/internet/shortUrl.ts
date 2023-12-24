import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import axios from 'axios';

let command: CommandOptions = {
    name: "shorturl",
    aliases: ["shorten", "short"],
    type: CommandTypes.Internet,
    usage: "shorturl [url]",
    examples: ["shorturl https://google.com", "shorturl https://discord.gg/xXxXxXxXxX"],
    cooldown: 120,
    premiumCooldown: 60,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("shorturl") || client.language.get("en")?.get("shorturl");
        const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+)\.([a-zA-Z0-9]+)([a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
        if (!args[0]) return client.utils.sendErrorEmbed(client, language, message, this, client.utils.CommandsErrorTypes.InvalidArgument, lang.errors.noUrl);
        if (!urlRegex.test(args[0])) return client.utils.sendErrorEmbed(client, language, message, this, client.utils.CommandsErrorTypes.InvalidArgument, lang.errors.invalidUrl);
        const shortUrl = await axios.get(`https://tinyurl.com/api-create.php?url=${args[0]}`).then((res) => res.data).catch((err) => undefined);

        console.log(shortUrl)

        if(!shortUrl) return client.utils.sendErrorEmbed(client, language, message, this, client.utils.CommandsErrorTypes.InvalidArgument, lang.errors.invalidUrl);

        const embed = new EmbedBuilder()
            .setTitle(lang?.embed?.title)
            .addFields({
                name: lang?.embed?.fields[0]?.name,
                value: `\`\`\`\n${args[0]}\`\`\``
            }, {
                name: lang?.embed?.fields[1]?.name,
                value: `\`\`\`\n${shortUrl}\`\`\``
            })
            .setTimestamp()
            .setColor(message.member?.displayHexColor || message.guild?.members.me?.displayHexColor || 'Random')
            .setFooter({
                text: message.author.tag,
                iconURL: message.author.displayAvatarURL()
            })

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(lang?.buttons?.originalLink)
                    .setStyle(ButtonStyle.Link)
                    .setURL(args[0])
                    .setEmoji("🔗"),
                new ButtonBuilder()
                    .setLabel(lang?.buttons?.shortLink)
                    .setStyle(ButtonStyle.Link)
                    .setURL(shortUrl)
                    .setEmoji("🔗"),
            );

        return message.channel.send({ embeds: [embed], components: [row] })

    }

}

export = command;