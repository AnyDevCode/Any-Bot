import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder, Attachment  } from 'discord.js';

import axios from "axios";

let command: CommandOptions = {
    name: "test",
    ownerOnly: true,
    type: CommandTypes.Owner,
    async run(message, args, client) {
        //Check if have a attachment
        if (message.attachments.size > 0) {
            //Get the attachment
            const attachment = message.attachments.first();

            if (!attachment) return message.channel.send("No attachment found");

            return message.channel.send(await client.utils.upload(attachment, message, client));

            
        } else {
            message.channel.send("No attachment found");
        }
    }
}

export = command;
