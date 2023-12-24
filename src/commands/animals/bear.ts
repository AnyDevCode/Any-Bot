import { CommandTypes, CommandOptions, AnimalData } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';
import axios from 'axios';

let command: CommandOptions = {
    name: "bear",
    type: CommandTypes.Animals,
    cooldown: 10,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("bear") || client.language.get("en")?.get("bear");
        let data: AnimalData;
        try {
            const { data: thedata } = await axios.get(client.apiURL + "/bear");
            data = thedata;
        } catch (e) {
            return message.channel.send(lang.error);
        }
        if (!data) return message.channel.send(lang.error);

        const embed = new EmbedBuilder()
            .setTitle(lang.embed.title)
            .setColor(client.user?.hexAccentColor || message.author.hexAccentColor || "Random")
            .setTimestamp()
            .setFooter({
                text: message.guild?.name || message.author.username,
                iconURL: message.guild?.iconURL() || message.author.displayAvatarURL()
            })
            .setImage(data.image || "http://api.any-bot.xyz/img/dog/1456014646-1315246163.jpg")
            .addFields({
                name: lang.embed.fields.fact.name,
                value: data.fact || "IDK, this is a error, lol"
            })

        return message.channel.send({ embeds: [embed] });
    }
}

export = command;