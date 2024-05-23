import axios from 'axios';
import { CommandTypes, CommandOptions, CommandsErrorTypes } from '../../utils/utils';
import { AttachmentBuilder } from 'discord.js';

let command: CommandOptions = {
    name: "dalle",
    type: CommandTypes.AI,
    examples: ["dalle Red Car", "dalle Dog with mask"],
    usage: "dalle [prompt]",
    premiumCooldown: 90,
    premiumOnly: true,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("dalle") || client.language.get("en")?.get("dalle");

        if (!args[0]) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.InvalidArgument, lang.errors.noArgs);

        const response = await client.utils.dalle(message);

        if (!response) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.InvalidArgument, lang.errors.noResponse)

        //Download image
        let imageRaw = await axios.get(response, { responseType: "arraybuffer" })

        if (!imageRaw) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.noResponse);

        //console.log(res)
        const image = new AttachmentBuilder(imageRaw.data).setName("ia-image.png");

        // if(!response) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.noResponse);

        return message.reply({
            files: [image]
        })
    }
}

export = command;