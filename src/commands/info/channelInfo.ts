import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder, ChannelType } from 'discord.js';
import moment from 'moment';
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
        let langChannelTypes = client.language.get(language || "en")?.get("channeltypes") || client.language.get("en")?.get("channeltypes");
        let lang = client.language.get(language || "en")?.get("channelinfo") || client.language.get("en")?.get("channelinfo");

        let channel = message.guild?.channels.cache.get(args[0]) || message.mentions.channels.first() || message.channel;

        if(!channel) return message.channel.send(lang.errors.invalidChannel);

        const embed = new EmbedBuilder()
            .setTitle(lang.embed.title)
            .setThumbnail(message.guild?.iconURL() || "")
            .addFields({
                name: lang.embed.fields.name,
                value: channel.toString(),
                inline: true
            },
                {
                    name: lang.embed.fields.id,
                    value: `\`${channel.id}\``,
                    inline: true
                },
                {
                    name: lang.embed.fields.type,
                    value: `\`${langChannelTypes[channelTypes[channel.type] || "Unknown"]}\``,
                    inline: true
                },
                {
                    name: lang.embed.fields.created,
                    value: `\`${moment(channel.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss A")}\``,
                    inline: true
                })
            .setColor("Random")
            .setFooter({
                text: message.member?.displayName || message.author.username,
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp()

        if (channel.type === ChannelType.GuildText) {
            embed.addFields({
                name: lang.embed.fields.nsfw,
                value: channel.nsfw ? `\`${lang.embed.fields.yes}\`` : `\`${lang.embed.fields.no}\``,
                inline: true
            }, {
                name: lang.embed.fields.slowmode,
                value: channel.rateLimitPerUser ? `\`${channel.rateLimitPerUser} ${lang.embed.fields.seconds}\`` : `\`${lang.embed.fields.none}\``,
                inline: true
            }, {
                name: lang.embed.fields.members,
                value: `\`${channel.members.size.toString()}\``,
                inline: true
            }, {
                name: lang.embed.fields.bots,
                value: `\`${channel.members.filter(m => m.user.bot).size.toString()}\``,
                inline: true
            })
        } else
            if (channel.type === ChannelType.GuildVoice) {
                embed.addFields({
                    name: lang.embed.fields.bitrate,
                    value: `\`${channel.bitrate.toString()} ${lang.embed.fields.kbps}\``,
                    inline: true
                }, {
                    name: lang.embed.fields.userLimit,
                    value: `\`${channel.userLimit.toString()}\``,
                    inline: true
                }, {
                    name: lang.embed.fields.full,
                    value: channel.full ? `\`${lang.embed.fields.yes}\`` : `\`${lang.embed.fields.no}\``,
                    inline: true
                })
                const members = Array.from(channel.members.values());
                if (members.length > 0) {
                    embed.addFields({
                        name: lang.embed.fields.membersJoined,
                        value: `\`\`\`diff\n + ${members.map(m => m.user.tag).join("\n + ")}\`\`\``,
                        inline: true
                    })
                } else {
                    embed.addFields({
                        name: lang.embed.fields.membersJoined,
                        value: `\`\`\`diff\n - ${lang.embed.fields.noMembers}\`\`\``,
                        inline: true
                    })
                }
            }

        if (channel.isTextBased() && !channel.isDMBased() && !channel.isThread() && !channel.isVoiceBased() && channel.topic) {
            embed.addFields({
                name: lang.embed.fields.topic,
                value: `\`\`\`\n${channel.topic}\`\`\``,
            })
        }


        return message.channel.send({ embeds: [embed] })

    }
}

export = command;
