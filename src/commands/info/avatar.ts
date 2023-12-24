import { CommandOptions, CommandTypes } from "../../utils/utils";
import { EmbedBuilder } from "discord.js";

let command: CommandOptions = {
    name: "avatar",
    type: CommandTypes.Info,
    aliases: ["profilepic", "pfp"],
    usage: "avatar <user mention | user id>",
    examples: ["avatar @user", "avatar 123456789", "avatar"],
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("avatar") ||
            client.language.get("en")?.get("avatar");
        const user = message.mentions.users.first() ||
            await client.utils.getUserByIDorMention(message, args[0]) ||
            message.author;

        const customAvatar = message.guild
            ? await client.utils.getMemberAvatar(user, message.guild, client)
            : null;

        const embed = new EmbedBuilder()
            .setTitle(
                lang?.embed?.title?.replace(
                    /%%USER%%/g,
                    (user.discriminator && user.discriminator !== "0")
                        ? user.tag
                        : user.username,
                ),
            )
            .setImage(user.displayAvatarURL({ size: 4096 }))
            .setColor("Random")
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL(),
            })
            .setTimestamp()
            .setFields({
                name: lang?.embed?.fields?.originalAvatar,
                value: lang?.embed?.fields?.originalAvatarValue?.replace(
                    /%%AVATARURL%%/g,
                    user.displayAvatarURL({ size: 4096 }),
                ),
            });

        if (customAvatar) {
            embed.setURL("https://any-bot.xyz/");
            embed.setFields({
                name: lang?.embed?.fields?.originalAvatar,
                value: lang?.embed?.fields?.originalAvatarValue?.replace(
                    /%%AVATARURL%%/g,
                    user.displayAvatarURL({ size: 4096 }),
                ),
            }, {
                name: lang?.embed?.fields?.customAvatar,
                value: lang?.embed?.fields?.customAvatarValue?.replace(
                    /%%AVATARURL%%/g,
                    customAvatar,
                ),
            });

            const embed2 = new EmbedBuilder()
                .setImage(customAvatar)
                .setURL("https://any-bot.xyz/");

            return message.channel.send({ embeds: [embed, embed2] });
        } else return message.channel.send({ embeds: [embed] });
    },
};

export = command;
