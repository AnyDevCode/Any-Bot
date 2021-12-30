// Dependencies:
const {MessageEmbed} = require('discord.js');
const fetch = require('node-fetch');
// Command Require:
const Command = require('../Command.js');

// Command Definition:
module.exports = class ChatBotCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'chatbot',
            aliases: ['chb', 'cbot'],
            usage: 'chatbot <message>',
            description: 'He answers what you tell him.',
            type: client.types.FUN
        });
    }

    // Command Code:
    async run(message, args) {

        // String to URL encode:
        const {stringToUrlEncoded} = message.client.utils;

        // Check if it has args:
        if (!args[0]) return this.sendErrorMessage(message, 0, 'Put some text that you want me to answer you');
        // Args:
        let text = args.join(" ");
        // Try to fetch the answer:
        try {
            // Get the Api Key:
            const apiKey = message.client.apiKeys.somerandomapikey
            // Fetch the answer:
            const res = await fetch(`https://some-random-api.ml/chatbot?message=${stringToUrlEncoded(text)}&key=${apiKey}`);
            // Get the answer:
            const answer = (await res.json());
            // Create the embed:
            const embed = new MessageEmbed()
                .setTitle(':robot:  Chat Bot!  :robot:')
                .setDescription(answer.response)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                .setColor(message.guild.me.displayHexColor);
            // Check if the answer is valid:
            if (answer.error) return embed.setDescription("I'm sorry, I can't answer that right now. Please try again later.");
            // Send the embed:
            message.channel.send(embed);
        } catch (err) {
            // Send the error message:
            this.sendErrorMessage(message, 1, "I'm sorry, I can't answer that right now. Please try again later.");
        }
    }
};
