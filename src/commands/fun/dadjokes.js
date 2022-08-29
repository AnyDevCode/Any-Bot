const Command = require('../Command.js');
const axios = require("axios");
const {
    MessageEmbed
} = require('discord.js');
module.exports = class DadJokesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dadjokes',
            aliases: ['dadjk'],
            description: 'Tells you a dad joke.',
            type: client.types.FUN
        });
    }

    async run(message) {
        const headers = {
            "User-Agent": "Any Bot (https://github.com/MDCYT/Any-Bot)",
            "Accept": "application/json"
        }
        const res = await axios
            .get('https://icanhazdadjoke.com/', {
                headers: headers
            })
            .then((res) => res.data)
            .catch((err) => {
                message.client.logger.error(err.stack);
                return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
            });
        const embed = new MessageEmbed()
            .setTitle('🤣 Dad Joke 🤣')
            .setDescription(res.joke)
            .setFooter({
                text: message.member.displayName,
                iconURL: message.author.displayAvatarURL({
                    dynamic: true
                }),
            })
            .setTimestamp()
            .setColor(message.guild.me.displayHexColor);
        message.channel.send({
            embeds: [embed]
        });
    }
};
