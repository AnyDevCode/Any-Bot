import axios from 'axios';
import { CommandTypes, CommandOptions, CommandsErrorTypes } from '../../utils/utils';
import { EmbedBuilder, AttachmentBuilder } from 'discord.js';

let command: CommandOptions = {
    name: "yesno",
    type: CommandTypes.Fun,
    aliases: ['yn'],
    usage: 'yesno',
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("yesno") || client.language.get("en")?.get("yesno");

        const res = await axios.get('https://yesno.wtf/api/')
            .then((res) => res.data)
            .catch((err) => undefined)
        if (!res) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.tryLater, lang.errors.APIDown);

        //Download image
        let imageRaw = await axios.get(res.image, { responseType: "arraybuffer" })

        if (!imageRaw) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.tryLater, lang.errors.APIDown);

        //console.log(res)
        const image = new AttachmentBuilder(imageRaw.data).setName("yesno.gif");

        let answer = client.utils.capitalize(res.answer);
        if (answer === 'Yes') answer = '👍  ' + answer + '!  👍';
        else if (answer === 'No') answer = '👎  ' + answer + '!  👎';
        else answer = '👍  ' + answer + '...  👎';

        const embed = new EmbedBuilder()
            .setTitle(answer)
            .setImage("attachment://yesno.gif")
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp()
            .setColor(message.guild?.members?.me?.displayHexColor || message.member?.displayHexColor || "Random")
        message.reply({
            embeds: [embed],
            files: [image]
        });
    }
}

export = command;