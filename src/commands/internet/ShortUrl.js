const Command = require('../Command.js');
const {
    oneLine
} = require('common-tags');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = class ShortURLCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'shorturl',
            usage: 'shorturl [url]',
            description: oneLine `
        Shortens a URL.
      `,
            type: client.types.INTERNET,
            examples: ['shorturl https://google.com', 'shorturl https://mdcdev.me']
        });
    }
    async run(message, args) {

        if (!args[0]) return this.sendErrorMessage(message, 0, "Please provide a URL to shorten");

        //Regex to check if URL is valid
        const regex = /(?:(?:https?|ftp|mailto):\/\/)?(?:www\.)?(([^\/\s]+\.[a-z\.]+)(\/[^\s]*)?)(?:\/)?/ig;

        let DomainsArgs = [];
        const theMessage = message.content;

        for (let match of theMessage.matchAll(regex)) {
            DomainsArgs.push(match[0]);
        }

        if (!DomainsArgs[0]) return this.sendErrorMessage(message, 0, "Please provide a URL to shorten");

        //If URL dont start with http:// or https://, add it
        if (!DomainsArgs[0].startsWith("http://") && !DomainsArgs[0].startsWith("https://")) {
            DomainsArgs[0] = "https://" + DomainsArgs[0];
        }

        //Shorten URL
        const shortUrl = await axios.get(`https://tinyurl.com/api-create.php?url=${DomainsArgs[0]}`).then(res => res.data);

        //Send shortened URL
        const embed = new MessageEmbed()
            .setTitle("Short URL:")
            .setDescription(`${DomainsArgs[0]} => ${shortUrl}`)
            .setColor(message.guild.me.displayHexColor)
            .setFooter({
                text: message.member.displayName,
                icon_url: message.author.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();
        return message.channel.send({ embeds: [embed] });
    }
}