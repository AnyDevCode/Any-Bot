import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import axios from 'axios';

let command: CommandOptions = {
    name: "astronomypicture",
    type: CommandTypes.Fun,
    aliases: ['ap', "apod"],
    usage: "astronomypicture",
    cooldown: 60,
    premiumCooldown: 30,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("astronomypictureofday") || client.language.get("en")?.get("astronomypictureofday");
        const apiKey = client.apiKeys.get("NASAAPI");
        const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&thumbs=true`;

        try {
            await axios.get(url).then(async res => {
                const date = new Date(res.data.date);
                // Check if the media_type is an image:
                const embed = new EmbedBuilder()
                    .setColor(message.guild?.members.me?.displayColor || "Random")
                    .setTitle(res.data.title)
                    .setDescription(res.data.explanation)
                    .setTimestamp(date)
                    .setFooter({
                        text: lang.embed.footer,
                        iconURL: "https://www.panoramaaudiovisual.com/wp-content/uploads/2016/02/NASA-Tv.jpg"
                    })
                if (res.data.media_type === 'image') {
                    embed.setImage(res.data.url);

                    if (res.data.hdurl) {
                        const row = new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel(lang.buttons.hd)
                                    .setStyle(ButtonStyle.Link)
                                    .setURL(res.data.hdurl)
                                    .setEmoji("🖼️")
                            );

                        return message.channel.send({ embeds: [embed], components: [row] });
                    }

                    return message.channel.send({ embeds: [embed] });

                } else {
                    // Create the Embed:
                    embed.setImage(res.data.thumbnail_url)

                    const row = new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(lang.buttons.video)
                                .setStyle(ButtonStyle.Link)
                                .setURL(res.data.url)
                                .setEmoji("🎥")
                        );

                    return message.channel.send({ embeds: [embed], components: [row] });
                }
            })
        } catch (e) {
            return message.channel.send({ content: lang.errors.apiError });
        }
    }
}

export = command;