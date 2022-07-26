const {
    MessageEmbed
} = require("discord.js");
const {
    stripIndents
} = require("common-tags");
const fs = require("fs");
const {
    join
} = require("path");

let phisingLinks = null;
let cache_date;

function update_cache() {
    if (phisingLinks === null || Date.now() - cache_date > (1000 * 60 * 60)) {
        fs.readFile(join(__basedir, "data/PhishingLinks.json"), (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            phisingLinks = JSON.parse(data);
        })
        cache_date = Date.now();
    }
}

update_cache();

module.exports = {
    name: "messageCreate",
    async execute(message, _commands, client) {
        if (message.channel.type === "DM") return;
        if (!message.channel.viewable || message.author.bot) return;


        // Get Phishing Config
        let {
            antiPhishing: antiPhishing,
            antiPhishingLogsChannelID: antiPhishingLogsChannelId,
            antiPhishingSystem: antiPhishingSystem
        } = await client.mongodb.settings.selectRow(message.guild.id);

        if (antiPhishing) {
            update_cache()

            // Match urls only
            // Example: https://discordapp.com/test/
            // Group 1: domain + path (discordapp.com/test)
            // Group 2: domain (discordapp.com)
            // Group 3: path (/test)

            const regex = /(?:(?:https?|ftp|mailto):\/\/)?(?:www\.)?(([^\/\s]+\.[a-z\.]+)(\/[^\s]*)?)(?:\/)?/ig;

            let susDomainsArgs = [];

            // Extract all the matched urls
            const theMessage = message.content;
            for (let match of theMessage.matchAll(regex)) {
                susDomainsArgs.push(match[1]);
                susDomainsArgs.push(match[2]);
            }

            // Check if the message contains a phishing link
            // PhishingLinks have a property called "domains", which is an array of domains
            // If the message contains a phishing link, the bot will send a message to the mod channel

            let phishingLink = false;

            for (let PhishingLink of phisingLinks.domains) {
                for (let domain of susDomainsArgs) {
                    if (PhishingLink === domain) {
                        phishingLink = true;
                        break;
                    }
                }
            }

            if (phishingLink) {
                const antiPhishingLogsChannel = message.guild.channels.cache.get(antiPhishingLogsChannelId);
                if (antiPhishingLogsChannel) {

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
            }
        }
    }
}