import { CommandTypes, CommandOptions } from '../../utils/utils';
import figlet from 'figlet';

let command: CommandOptions = { 
    name: "ascii",
    usage: "ascii [text]",
    type: CommandTypes.Fun,
    aliases: ["asciify"],
    examples: ["ascii hello", "ascii hi"],
    cooldown: 10,
    premiumCooldown: 5,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("ascii") || client.language.get("en")?.get("ascii");
        // Check if it has args:
        if (!args[0]) return client.utils.sendErrorEmbed(client, language, message, this, client.utils.CommandsErrorTypes.InvalidArgument, lang.errors.noText);
        // Check if args not are longer than 15 characters:
        if (args.join(" ").length < 15) figlet(args.join(" "), (err, data) => message.reply({
            content: "```" + data + "```"
        }))
        else {
            //Create a temp file to store the ascii text:
            const tempFile = await client.utils.createTempFile();
            // Create the ascii text:
            figlet(args.join(" "), async (err, data) => {
                // Write the ascii text to the temp file:
                await client.utils.writeToFile(tempFile, data || "");
                // Send the file:
                message.reply({
                    files: [{
                        attachment: tempFile.path,
                        name: "ascii.txt"
                    }]
                }).then(async () => {
                    // Delete the temp file:
                    await client.utils.deleteFile(tempFile);
                })
            })

        }
    }
}

export = command;