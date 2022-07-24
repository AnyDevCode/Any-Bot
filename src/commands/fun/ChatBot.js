// Dependencies:
const {MessageEmbed} = require('discord.js');
const cleverbot = require("cleverbot-free");
// Command Require:
const Command = require('../Command.js');

// Command Definition:
module.exports = class ChatBotCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'chatbot',
            aliases: ['chb', 'cbot', 'brain'],
            usage: 'chatbot <message>',
            description: 'He answers what you tell him.',
            cooldown: 5,
            type: client.types.FUN
        });
    }

    // Command Code:
    async run(message, args) {


        // Check if it has args:
        if (!args[0]) return this.sendErrorMessage(message, 0, 'Put some text that you want me to answer you');
        // Args:
        let text = args.join(" ");
        // Try to fetch the answer:

            await cleverbot(text).then(response => {
                const embed = new MessageEmbed()
                    .setTitle(':robot:  Chat Bot!  :robot:')
                    .setDescription(response)
                    .setFooter({
                        text: message.member.displayName,
                        iconURL: message.author.displayAvatarURL({ dynamic: true }),
                    })
                    .setTimestamp()
                    .setColor(message.guild.me.displayHexColor);
                return message.channel.send({embeds: [embed]});
            }).catch(async () => { 
            // Send the error message:
            await this.sendErrorMessage(message, 1, "I'm sorry, I can't answer that right now. Please try again later."); 
        })

    }
};
