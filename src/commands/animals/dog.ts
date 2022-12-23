import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';
import axios, {AxiosResponse} from 'axios';

let command: CommandOptions = {
    name: "dog",
    type: CommandTypes.Animals,
    aliases: ["doggo", "doge"],
    cooldown: 10,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("dog") || client.language.get("en")?.get("dog");
        let data: object | Buffer;
        try{
            const { data: thedata } = await axios.get(client.apiURL + "/dog");
            data = thedata;
        } catch (e) {
            return message.channel.send(lang.error);
        }
        if(!data) return message.channel.send(lang.error);
        //If is buffer, console log the buffer
        if(typeof data !== "object") return message.channel.send(lang.error);
        // Data have a image property with the image url
    
        const embed = new EmbedBuilder()
            .setTitle(lang.title)
            .setColor(client.user?.hexAccentColor || message.author.hexAccentColor || "Random")
            .setTimestamp()
            .setFooter({
                text: message.guild?.name || message.author.username,
                iconURL: message.guild?.iconURL() || message.author.displayAvatarURL()
            })
            /* @ts-ignore */
            .setImage(data.image);

        return message.channel.send({ embeds: [embed] });
    }
}

export = command;