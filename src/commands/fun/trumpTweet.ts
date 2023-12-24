import axios from 'axios';
import { CommandTypes, CommandOptions, CommandsErrorTypes } from '../../utils/utils';
import { EmbedBuilder, AttachmentBuilder } from 'discord.js';

let command: CommandOptions = {
    name: "trumptweet",
    type: CommandTypes.Fun,
    aliases: ['trump'],
    usage: 'trumptweet <message>',
    examples: ['trumptweet Any Bot is the best Discord Bot!'],
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("trumptweet") || client.language.get("en")?.get("trumptweet");

        // Get message
        if (!args[0]) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.InvalidArgument, lang.errors.noArgs);
        let tweet = client.utils.stringToUrlEncoded(args.join(' '));
        if (tweet.length > 68) tweet = tweet.slice(0, 65) + '...';

        const res = await axios.get(`https://nekobot.xyz/api/imagegen?type=trumptweet&text=${tweet}`)
            .then((res) => res.data)
            .catch((_err) => undefined)

        if (!res) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.tryLater, lang.errors.APIDown);

        //Download image
        let imageRaw = await axios.get(res.message, { responseType: "arraybuffer" })

        if (!imageRaw) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.tryLater, lang.errors.APIDown);

        //console.log(res)
        const image = new AttachmentBuilder(imageRaw.data).setName("trumptweet.png");
        //Res is a string with image data, make a Buffer and crate a Attachment
        // const imageBuffer = ~~(res.data.split(',')[1].split(':')[1].split
        const embed = new EmbedBuilder()
            .setTitle(lang.embed.title)
            .setImage("attachment://trumptweet.png")
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp()
            .setColor(message.guild?.members?.me?.displayHexColor || message.member?.displayHexColor || "Random")
        message.channel.send({
            embeds: [embed],
            files: [image]
        });
    }
}

export = command;