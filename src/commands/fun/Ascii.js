// Dependencies:
const figlet = require('figlet');
// Command Require:
const Command = require('../Command.js');

// Command Definition:
module.exports = class AsciiCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ascii',
            usage: 'ascii <text>',
            description: 'Convert the text to ascii.',
            type: client.types.FUN,
            examples: ['ascii Hello']
        });
    }

    // Command Code:
    run(message, args) {
        // Check if it has args:
        if (!args[0]) return message.reply({content:"You must enter the text first"})
        // Check if args not are longer than 15 characters:
        if (args.join(" ") > 15) message.reply({content: "Text cannot contain more than 15 Characters"})
        // Create the ascii:
        figlet(args.join(" "), (err, data) => message.channel.send({
            content: "```" + data + "```"
        }))
    }
};
