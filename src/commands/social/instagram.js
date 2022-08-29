const Command = require('../Command.js');
const {
    MessageEmbed
} = require('discord.js');
const InstagramAPI = require("instatouch")
const {
    abbreviateNumber
} = require("js-abbreviation-number");

module.exports = class InstragramCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'instagram',
            usage: 'instagram <username>',
            description: 'Instagram Profile.',
            type: client.types.SOCIAL,
            examples: ['instagram mdcdev', 'instagram @mdcdev'],
        });
    }
    async run(message, args) {

        const username = args.join(' ').replace(/[^a-zA-Z0-9 ]/g, "");

        const user = await InstagramAPI.getUserMeta(username).catch(err => {
            this.client.logger.error(err.stack);
            return message.reply(`The Instagram API is actualy innaccessible. Please try again later.`);
        })

        if (!user) return message.reply(`The user ${username} doesn't exist or is innaccessible.`);

        const userData = user.graphql.user;
        const embed = new MessageEmbed()
            .setTitle(`${userData.full_name}'s Instagram Profile` + (userData.is_private ? ' (Private)' : '') + (userData.is_verified ? ' (Verified)' : ''))
            .setURL(`https://www.instagram.com/${username}/`)
            .setThumbnail(userData.profile_pic_url_hd || userData.profile_pic_url)
            .setColor(message.guild.me.displayColor)
            .addField('Username', userData.username, true)
            .addField('Followers', `${abbreviateNumber(userData.edge_followed_by.count)}`, true)
            .addField('Following', `${abbreviateNumber(userData.edge_follow.count)}`, true)
            .addField('Posts', `${userData.edge_owner_to_timeline_media.count}`, true)
            .addField('Bio', userData.biography ? userData.biography : 'None', true)
            .addField('External Links', `[Website](${userData.external_url}) `, true)
            .setTimestamp()
            .setFooter({
                text: message.member.displayName,
                iconURL: message.author.displayAvatarURL({
                    dynamic: true
                })
            })

        return message.reply({
            embeds: [embed]
        });
    }
};
