import { CommandTypes, CommandOptions, AnimalData } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';
import axios from 'axios';

let command: CommandOptions = {
    name: "cat",
    type: CommandTypes.Animals,
    aliases: ["kitty"],
    cooldown: 10,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("cat") || client.language.get("en")?.get("cat");
        let data: AnimalData;
        try {
            const { data: thedata } = await axios.get(client.apiURL + "/cat");
            data = thedata;
        } catch (e) {
            return message.reply(lang.error);
        }
        if (!data) return message.reply(lang.error);

        const embed = new EmbedBuilder()
            .setTitle(lang.embed.title)
            .setColor(client.user?.hexAccentColor || message.author.hexAccentColor || message.guild?.members.cache.get(client.user?.id as string)?.roles.color?.color || "Random")
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

        return message.reply({ embeds: [embed] });
    }
}

export = command;