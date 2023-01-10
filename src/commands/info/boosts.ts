import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';

let command: CommandOptions = {
    name: "boosts",
    type: CommandTypes.Info,
    aliases: ["boost", "bs"],
    cooldown: 5,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("boosts") || client.language.get("en")?.get("boosts");
        const guild = message.guild || await client.guilds.fetch(message.guildId || "");
        const members = await guild.members.fetch();
        const usersBoosting = members.filter(m => m.premiumSince).map(m => m.user.tag);
        const embed = new EmbedBuilder()
            .setTitle(lang.embed.title)
            .setColor(client.user?.hexAccentColor || message.author.hexAccentColor || "Random")
            .setFooter({
                text: message.member?.displayName || message.author.username,
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp()
            .setDescription(lang.embed.description.replace("%%BOOSTS%%", guild.premiumSubscriptionCount).replace("%%TIER%%", guild.premiumTier.toString()).replace("%%BOOSTERS%%", usersBoosting.length.toString()).replace("%%BOOSTERLIST%%", usersBoosting.join(", ") || "No one is boosting this server").replace("%%BOOSTSPERKS%%", lang.boosts[guild.premiumTier.toString()].join(", ") || lang.boosts["none"]))
        return message.channel.send({ embeds: [embed] })
    }
}

export = command;