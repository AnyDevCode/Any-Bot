const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { abbreviateNumber } = require("js-abbreviation-number");

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

        try {
            const user = await axios.get(`https://www.instagram.com/${username}/?__a=1`);
            const userData = user.data.graphql.user;
            const embed = new MessageEmbed()
                .setTitle(`${userData.full_name}'s Instagram Profile` + (userData.is_private ? ' (Private)' : '') + (userData.is_verified ? ' (Verified)' : ''))
                .setURL(`https://www.instagram.com/${username}/`)
                .setThumbnail(userData.profile_pic_url_hd)
                .setColor(message.guild.me.displayColor)
                .addField('Username', userData.username)
                .addField('Followers', `${abbreviateNumber(userData.edge_followed_by.count)}`)
                .addField('Following', `${abbreviateNumber(userData.edge_follow.count)}`)
                .addField('Posts', `${userData.edge_owner_to_timeline_media.count}`)
                .addField('Bio', userData.biography ? userData.biography : 'None')
                .addField('External Links', `[Website](${userData.external_url}) `)
                .setTimestamp()
                .setFooter({
                    text: message.member.displayName,
                    iconURL: message.author.displayAvatarURL({ dynamic: true })
                  })
            return message.reply({embeds: [embed]});
        } catch (err) {
            this.client.logger.error(err.stack);
            return message.reply(`I couldn't find that user.`);
        }
    }
};
