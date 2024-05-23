import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';
import { Client as MDCClient } from 'mdcdev.js';
import { abbreviateNumber } from "js-abbreviation-number";

const Client = new MDCClient();

let command: CommandOptions = {
    name: "twitter",
    type: CommandTypes.Social,
    usage: "twitter <username>",
    aliases: ["twitteruser", "twitteruserprofile", "twuser", "twuserprofile", "x", "xuser", "xuserprofile"],
    examples: ["twitter mrbeast", "twitter elonmusk"],
    async run(message, args, client, language) {
        if(!args[0]) return client.utils.sendErrorEmbed(client, language, message, this, client.utils.CommandsErrorTypes.InvalidArgument, "Please enter a username.");

        // Get the username from the message
        let [ username ] = args;

        // Get the user's twitter data
        const twitter = await Client.x.users.get(username);

        // If the user doesn't exist, return a message
        if(!twitter || !twitter.data || twitter.code !== 200 ) return client.utils.sendErrorEmbed(client, language, message, this, client.utils.CommandsErrorTypes.NoDataFound, "The user doesn't exist.");

        const twitterUser = twitter.data;

        let embed = new EmbedBuilder()
            .setTitle(`${twitterUser.fullName} (@${twitterUser.userName})`)
            .setURL(`https://twitter.com/${twitterUser.userName}`)
            .setThumbnail(twitterUser.profileImage)
            .addFields(
                { name: "Followers", value: `\`\`\`${abbreviateNumber(twitterUser.followersCount)} (${twitterUser.followersCount})\`\`\``, inline: true },
                { name: "Following", value: `\`\`\`${abbreviateNumber(twitterUser.followingsCount)} (${twitterUser.followingsCount})\`\`\``, inline: true },
                { name: "Tweets", value: `\`\`\`${abbreviateNumber(twitterUser.statusesCount)} (${twitterUser.statusesCount})\`\`\``, inline: true },
                { name: "Location", value: `\`\`\`${twitterUser.location || "Unknown"}\`\`\``, inline: true },
                { name: "Bio", value: `\`\`\`${twitterUser.description.replace("`", "'") || "No bio" }\`\`\``, inline: false },
            )
            .setTimestamp(new Date(twitterUser.createdAt))
            .setFooter({
                text: `Twitter/X User ID: ${twitterUser.id}`,
                iconURL: message.author.avatarURL() || ""
            })
            .setColor(client.user?.hexAccentColor || message.author.hexAccentColor || message.guild?.members.cache.get(client.user?.id as string)?.roles.color?.color || "Random");

        if(twitterUser.profileBanner) embed.setImage(twitterUser.profileBanner);

        // Send the embed
        message.reply({ embeds: [embed] });

    }
}

export = command;
