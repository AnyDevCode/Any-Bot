const {
    MessageEmbed
} = require("discord.js");

const axios = require("axios");

module.exports = {
    name: "messageCreate",
    async execute(message, _commands, client) {

        // Check if the message is a DM or from a bot
        if (message.channel.type === "DM") return;
        if (!message.channel.viewable || message.author.bot) return;

        // Get Phishing Config
        let {
            antiPhishing: antiPhishing,
            antiPhishingLogsChannelID: antiPhishingLogsChannelId,
            antiPhishingSystem: antiPhishingSystem
        } = await client.mongodb.settings.selectRow(message.guild.id);

        // If the antiPhishingSystem is disabled, return
        if (!antiPhishing) return;

        // Create the regex for the antiPhishing
        const regex = /(?:(?:https?|ftp|mailto):\/\/)?(?:www\.)?(([^\/\s]+\.[a-z\.]+)(\/[^\s]*)?)(?:\/)?/ig;

        // Get all suspicious links
        let susDomainsArgs = [];

        // Extract all the matched urls
        const theMessage = message.content;
        for await (let match of theMessage.matchAll(regex)) {
            susDomainsArgs.push(match[1]);
            susDomainsArgs.push(match[2]);
        }

        // If there are no suspicious domains, return
        if (susDomainsArgs.length <= 0) return;

        // Get the apiUrl
        const {
            apiUrl
        } = client;

        // Check in api if the message is a phishing link
        const {
            data
        } = await axios.get(`${apiUrl}/api/v1/is_phishing?domain=${message.content}`);

        // If the message is not a phishing link or the website is down, return
        if (!data.isPhishing || data === undefined) return;

        // Check the antiPhishingSystem
        switch (antiPhishingSystem) {
            case 0:
                break
            case 1:
                message.delete();
                break
            case 2:
                message.delete();
                //TimeOut the user for 1 week
                if (message.member.moderatable && message.member.manageable) message.member.timeout(1000 * 60 * 60 * 7, "Phishing Link - AutoMod")
                else message.channel.send({
                    content: "The user " + message.author.tag + " is sending a phishing, please report this to the server owner or a mod.",
                })
                break
            case 3:
                message.delete();
                //Kick the user
                if (message.member.kickable && message.member.moderatable && message.member.manageable) message.member.kick("Phishing Link - AutoMod")
                else message.channel.send({
                    content: "The user " + message.author.tag + " is sending a phishing, please report this to the server owner or a mod.",
                })
                break
            case 4:
                message.delete();
                //Ban the user
                if (message.member.bannable && message.member.moderatable && message.member.manageable) message.member.ban("Phishing Link - AutoMod")
                else message.channel.send({
                    content: "The user " + message.author.tag + " is sending a phishing, please report this to the server owner or a mod.",
                })
                break
            default:
                break
        }

        // Get the antiPhishingLogsChannel
        const antiPhishingLogsChannel = message.guild.channels.cache.get(antiPhishingLogsChannelId);

        // If the antiPhishingLogsChannel is not found, return
        if (!antiPhishingLogsChannel) return;

        antiPhishingLogsChannel.send({
            embeds: [
                new MessageEmbed()
                .setTitle("Message Update: `Phishing Link Detected`")
                .setDescription(message.content)
                .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.displayAvatarURL({
                        dynamic: true
                    }),
                })
                .setTimestamp()
                .setColor(message.guild.me.displayHexColor)
                .setFooter({
                    text: `${client.user.username}`,
                    iconURL: client.user.avatarURL(),
                })
            ],
        });
    }

}