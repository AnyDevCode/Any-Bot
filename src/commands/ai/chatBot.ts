import { CommandTypes, CommandOptions, CommandsErrorTypes } from '../../utils/utils';

let command: CommandOptions = {
    name: "chatbot",
    type: CommandTypes.AI,
    aliases: ['chb', 'cbot', 'brain'],
    examples: ["chatbot Is this a good bot?", "chatbot What is your name?", "chatbot How i can make a good bot?"],
    usage: "chatbot [question]",
    premiumCooldown: 10,
    premiumOnly: true,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("chatbot") || client.language.get("en")?.get("chatbot");

        if (!args[0]) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.InvalidArgument, lang.errors.noArgs);

        await message.channel.sendTyping()

        const response = await client.utils.chatBot(message);

        if(!response) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.noResponse);

        return message.reply({content: response})
    }
}

export = command;