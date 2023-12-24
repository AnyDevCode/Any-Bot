import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';

let command: CommandOptions = {
    name: "boosts",
    type: CommandTypes.Info,
    aliases: ["boost", "bs"],
    cooldown: 5,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("boosts") || client.language.get("en")?.get("boosts");
        const guild = message.guild || await client.guilds.fetch(message.guildId as string);
        const members = await guild.members.fetch();
        let usersBoosting: string[] = members.filter(m => m.premiumSince).sort(client.utils.shortMemberByTimeStamp).map(m => client.emojisCollection.get("earlysupporter") + " **" + (m.user.discriminator && m.user.discriminator !== "0" ? m.user.tag : m.user.username) + "** <t:" + Math.round((m.premiumSinceTimestamp || 0) / 1000) + ":R> " + client.utils.getTimeBoostEmoji(client, m));
        let usersBoostingStringRaw = client.utils.limitString(usersBoosting.join("\n"), 4000)

        let usersBoostingString = usersBoosting.length >= 1 ? usersBoostingStringRaw + ((usersBoosting.length - usersBoostingStringRaw.split('\n').length) ? `\n${lang.messages.extra_boosters.replace("%%EXTRA_BOOSTERS_COUNT%%", (usersBoosting.length - usersBoostingStringRaw.split('\n').length).toString())}` : "") : `\`\`\`\n${lang.messages.no_boosters}\`\`\``;

        const embed = new EmbedBuilder()
            .setColor(client.user?.hexAccentColor || message.author.hexAccentColor || message.guild?.members.cache.get(client.user?.id as string)?.roles.highest.hexColor || "Random")
            .setTitle(lang.embed.title.replace(/%%SERVER_NAME%%/g, message.guild?.name))
            .setThumbnail(guild.iconURL({ size: 4096 }) || "https://cdn.discordapp.com/embed/avatars/0.png")
            .setFields({
                name: lang.embed.fields.boosts.title,
                value: lang.embed.fields.boosts.value.replace(/%%EMOJI_BOOST%%/g, client.emojisCollection.get("boost")).replace(/%%BOOSTS_COUNT%%/g, guild.premiumSubscriptionCount?.toString() || "0").replace(/%%BOOST_LEVEL%%/g, guild.premiumTier.toString()).replace(/%%BOOSTERS_COUNT%%/g, usersBoosting.length.toString())
            })
            .setTimestamp()
            .setDescription(lang.embed.description.replace(/%%BOOSTERS_LIST%%/g, usersBoostingString))
        return message.channel.send({ embeds: [embed] })
    }
}

export = command;