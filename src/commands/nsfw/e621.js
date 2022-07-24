const Command = require('../Command.js');
const {MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const booru = require("booru")

module.exports = class e621Command extends Command {
    constructor(client) {
        super(client, {
            name: 'e621',
            usage: 'e621 [tag]',
            description: 'Command with which you can search for images in e621',
            nsfw: true,
            type: client.types.NSFW
        });
    }

    async run(message, args) {
        if (!message.channel.nsfw) return this.sendErrorMessage(message, 2, 'Please use in a NSFW channel');
        const {stringToUrlEncoded} = message.client.utils;
        const tags = []
        for (let i = 0; i < args.length; i++) {
            tags[i] = stringToUrlEncoded(args[i]);
        }
        if (!tags) return message.channel.send("Write something to look for in e621.")
        booru.search('e621', tags, {limit: 1, random: true})
            .then(posts => {
                for (let post of posts) {
                    const embed = new MessageEmbed()
                        .setColor(message.guild.me.displayHexColor)
                        .setTitle(`Search result: ${tags.join(' ')}`)
                        .setImage(post.fileUrl)
                    const linkrow = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                            .setLabel("Direct link")
                            .setStyle("LINK")
                            .setEmoji("🔗")
                            .setURL("https://e621.net/post/show/" + post.id)
                        )
                    message.channel.send({embeds: [embed], components: [linkrow]})
                }
            }).catch(() => {
            message.channel.send("No results found.")
        })
    }
};
