import { CommandOptions, CommandTypes } from "../../utils/utils";
import {
    ChannelType,
    EmbedBuilder,
    ForumLayoutType,
    Guild,
    SortOrderType,
    TextChannel,
} from "discord.js";
import moment from "moment";
import ms from "ms";

const channelTypes = {
    [ChannelType.GuildText]: "Text",
    [ChannelType.DM]: "DM",
    [ChannelType.GuildVoice]: "Voice",
    [ChannelType.GroupDM]: "Group DM",
    [ChannelType.GuildCategory]: "Category",
    [ChannelType.GuildAnnouncement]: "Announcement",
    [ChannelType.AnnouncementThread]: "Announcement Thread",
    [ChannelType.PublicThread]: "Public Thread",
    [ChannelType.PrivateThread]: "Private Thread",
    [ChannelType.GuildStageVoice]: "Stage Voice",
    [ChannelType.GuildDirectory]: "Directory",
    [ChannelType.GuildForum]: "Forum",
};

let command: CommandOptions = {
    name: "channelinfo",
    type: CommandTypes.Info,
    aliases: ["ci", "channel"],
    cooldown: 5,
    usage: "channelinfo [channel / channel id]",
    examples: ["channelinfo #general", "channelinfo 123456789012345678"],
    async run(message, args, client, language) {

        let langChannelTypes =
            client.language.get(language || "en")?.get("channeltypes") ||
            client.language.get("en")?.get("channeltypes");
        let lang = client.language.get(language || "en")?.get("channelinfo") ||
            client.language.get("en")?.get("channelinfo");

        let channel = message.guild?.channels.cache.get(args[0]) ||
            message.mentions.channels.first() || message.channel;

        if (!channel) return message.reply(lang.errors.invalidChannel);

        const embed = new EmbedBuilder()
            .setTitle(lang.embed.title)
            // .setThumbnail(message.guild?.iconURL() || "")
            .addFields({
                name: lang.embed.fields.name,
                value: channel.toString(),
                inline: true,
            }, {
                name: lang.embed.fields.id,
                value: `\`${channel.id}\``,
                inline: true,
            }, {
                name: lang.embed.fields.type,
                value: `\`${langChannelTypes[channelTypes[channel.type as keyof typeof channelTypes] as keyof typeof langChannelTypes || "Unknown"]
                    }\``,
                inline: true,
            }, {
                name: lang.embed.fields.created,
                value: `<t:${Math.round((channel.createdTimestamp || 0) / 1000)}:F>`,
                inline: true,
            })
            .setColor("Random")
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL(),
            })
            .setTimestamp();

        if (channel.isTextBased() && !channel.isDMBased() && !channel.isVoiceBased() && !channel.isThread()) embed.addFields({
            name: lang.embed.fields.nsfw,
            value: channel.nsfw
                ? `\`${lang.embed.fields.yes}\``
                : `\`${lang.embed.fields.no}\``,
            inline: true,
        })

        switch (channel.type) {
            case ChannelType.GuildText:
                embed.addFields({
                    name: lang.embed.fields.slowmode,
                    value: channel.rateLimitPerUser
                        ? `\`${channel.rateLimitPerUser} ${lang.embed.fields.seconds}\``
                        : `\`${lang.embed.fields.none}\``,
                    inline: true,
                }, {
                    name: lang.embed.fields.members,
                    value: `\`${channel.members.size.toString()}\``,
                    inline: true,
                }, {
                    name: lang.embed.fields.bots,
                    value: `\`${channel.members.filter((m) => m.user.bot).size.toString()
                        }\``,
                    inline: true,
                }, {
                    name: lang.embed.fields.topic,
                    value: `\`${channel.topic || lang.embed.fields.none}\``,
                    inline: true,
                });

                break;
            case ChannelType.GuildVoice:
                if (!channel.isVoiceBased()) break;

                embed.addFields({
                    name: lang.embed.fields.bitrate,
                    value: `\`${channel.bitrate.toString()} ${lang.embed.fields.kbps}\``,
                    inline: true,
                }, {
                    name: lang.embed.fields.userLimit,
                    value: `\`${channel.userLimit.toString()}\``,
                    inline: true,
                }, {
                    name: lang.embed.fields.full,
                    value: channel.full
                        ? `\`${lang.embed.fields.yes}\``
                        : `\`${lang.embed.fields.no}\``,
                    inline: true,
                });
                const members = Array.from(channel.members.values());
                if (members.length > 0) {
                    embed.addFields({
                        name: lang.embed.fields.membersJoined,
                        value: `\`\`\`diff\n + ${client.utils.limitString(members.map((m) => m.user.tag).join("\n + "), 3800)
                            }\`\`\``,
                        inline: true,
                    });
                } else {
                    embed.addFields({
                        name: lang.embed.fields.membersJoined,
                        value: `\`\`\`diff\n - ${lang.embed.fields.noMembers}\`\`\``,
                        inline: true,
                    });
                }

                break;
            case ChannelType.GuildForum:
                if (channel.isVoiceBased()) break;
                embed.addFields({
                    name: lang.embed.fields.cooldownPerUser,
                    value: `\`${ms((channel.defaultThreadRateLimitPerUser || 0) * 1000, {
                        long: true,
                    })
                        }\``,
                    inline: true,
                }, {
                    name: lang.embed.fields.cooldownPerPost,
                    value: `\`${ms((channel.rateLimitPerUser || 0) * 1000, { long: true })
                        }\``,
                    inline: true,
                }, {
                    name: lang.embed.fields.autoArchivePost,
                    value: `\`${ms((channel.defaultAutoArchiveDuration || 10080) * 60 * 1000, {
                        long: true,
                    })
                        }\``,
                    inline: true,
                }, {
                    name: lang.embed.fields.tags,
                    value: `\`${channel.availableTags.map((t) => t.name).join(", ")}\``,
                    inline: true,
                }, {
                    name: lang.embed.fields.defaultReactionEmoji,
                    value: channel?.defaultReactionEmoji?.id
                        ? (client.emojis.cache.get(channel.defaultReactionEmoji?.id)
                            ?.toString() || lang.embed.fields.error)
                        : (channel?.defaultReactionEmoji?.name || `\n${lang.embed.fields.none}\n`),
                    inline: true,
                }, {
                    name: lang.embed.fields.defaultSortOrder,
                    value: `\`${lang
                        .sortOrderTypes[
                        channel.defaultSortOrder || SortOrderType.LatestActivity
                    ]
                        }\``,

                    inline: true,
                }, {
                    name: lang.embed.fields.defaultForumLayout,
                    value: `\`${lang
                        .forumLayoutTypes[
                        channel.defaultForumLayout || ForumLayoutType.NotSet
                    ]
                        }\``,
                    inline: true,
                }, {
                    name: lang.embed.fields.topic,
                    value: `\`\`\`\n${channel.topic}\`\`\``,
                    inline: false,
                });

                break;

        }

        return message.reply({ embeds: [embed] });
    },
};

export = command;
