import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import axios from 'axios';
var translate = require('node-google-translate-skidz');

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
                    .setTimestamp(date)
                    .setFooter({
                        text: lang.embed.footer,
                        iconURL: "https://www.panoramaaudiovisual.com/wp-content/uploads/2016/02/NASA-Tv.jpg"
                    })

                    var explanation = ""
                    if (language) {
                        if (language !== "en") {
                            const translateResponse = await translate({
                                text: res.data.explanation,
                                source: 'en',
                                target: language
                            });
                            explanation = "**(Translated with Google Translator)** " + translateResponse.translation;
                        } else explanation = res.data.explanation;
                        
                    } else explanation = res.data.explanation; 

                if(explanation && explanation.length <= 4096) embed.setDescription(explanation); // If the description is less than or equal to 4096 characters, it will display it.
                else embed.setDescription(explanation.substring(0, 4092) + "..."); // Otherwise, it will display the first 4090 characters of the description.

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

                        return message.reply({ embeds: [embed], components: [row] });
                    }

                    return message.reply({ embeds: [embed] });

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

                    return message.reply({ embeds: [embed], components: [row] });
                }

            })
        } catch (e) {
            return message.reply({ content: lang.errors.apiError });
        }
    }
}

export = command;