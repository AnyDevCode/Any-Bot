import { CommandTypes, CommandOptions, CommandsErrorTypes } from '../../utils/utils';
import { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import axios from 'axios';

let command: CommandOptions = {
    name: "meme",
    type: CommandTypes.Fun,
    usage: "meme",
    cooldown: 15,
    premiumCooldown: 5,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("meme") || client.language.get("en")?.get("meme");

        let res = await axios.get("https://meme-api.com/gimme/" + lang?.subreddits[Math.floor(Math.random() * lang.subreddits.length)])
            .then((res) => res.data)
            .catch((_err) => {
                return _err?.response?.data || undefined
            });

        if (!res) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.commandFailure, lang.errors.apiDown)


        //Error 403
        if (res.code === 403) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.commandFailure, lang.errors.blackReddit)

        //No URL
        if (!res.url) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.commandFailure, lang.errors.apiDown)

        //Download image
        let imageRaw = await axios.get(res.url, { responseType: "arraybuffer" })

        //Create attachment
        let attachment = new AttachmentBuilder(imageRaw.data).setName("meme.png").setSpoiler(res.spoiler);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(lang?.buttons?.post)
                    .setStyle(ButtonStyle.Link)
                    .setURL(res.postLink)
                    .setEmoji(client.emojisCollection.get("reddit") || "🔗")
            );

        const embed = new EmbedBuilder()
            .setTitle(res.title)
            .setImage("attachment://meme.png")
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp()
            .setFields([
                {
                    name: lang?.embed?.fields[0],
                    value: res.subreddit,
                    inline: true
                },
                {
                    name: lang?.embed?.fields[1],
                    value: String(res.ups),
                    inline: true
                }
            ])
            .setAuthor({
                name: res.author,
                url: res.postLink
            })
            .setColor(message.guild?.members.me?.displayHexColor || "Random");
        message.reply({
            embeds: [embed],
            files: [attachment],
            components: [row]
        });
    }
};

export = command;
