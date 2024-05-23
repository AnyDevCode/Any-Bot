import axios from 'axios';
import { CommandTypes, CommandOptions, CommandsErrorTypes, GDProfile } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';

let command: CommandOptions = {
    name: 'geometrydash',
    aliases: ["gduser"],
    usage: "gduser <name>",
    description: "Show information about any GeometryDash user.",
    examples: ["geometrydash Guillester", 'geometrydash Michigun'],
    type: CommandTypes.Games,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("geometrydash") || client.language.get("en")?.get("geometrydash");


        if (!args[0])
            return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.InvalidArgument, "Please enter a username.");

        await axios({
            method: 'GET',
            url: 'https://gdbrowser.com/api/profile/' + args[0]
        })
            .then(async (response: { data: GDProfile | number }) => {
                try {
                    if (typeof response.data === "number") return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.NoDataFound, "No existe el usuario.")

                    const user = response.data;

                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: "Geometry Dash",
                            iconURL: "https://2.bp.blogspot.com/-Wl1AS-zKl0s/VZVcSDOSckI/AAAAAAAAAJ8/WAFNDi4o_Hc/s1600/GeometryDash.png"
                        })
                        .setTitle(user.username)
                        .setColor(message.guild?.members?.me?.displayHexColor || message.member?.displayHexColor || "Random")
                        .setFields({
                            name: "<:stars:782318695790673931> | Stars",
                            value: `${user.stars}`,
                            inline: true
                        }, {
                            name: "<:coins:782316329935699968> | Coins",
                            value: `${user.coins}`,
                            inline: true
                        }, {
                            name: "<:user_coins:782317393668997150> | User Coins",
                            value: `${user.userCoins}`,
                            inline: true
                        }, {
                            name: "<:diamond:782319420206088274> | Diamonds", value: `${user.diamonds}`, inline: true
                        }, {
                            name: "<:creator_points:782320177889935410> | Creator Points",
                            value: `${user.cp}`,
                            inline: true
                        }, {
                            name: "<:demons:782320733367566337> | Demons",
                            value: `${user.demons}`,
                            inline: true
                        })
                        .setFooter({
                            text: "Top: " + (`${user.rank}` || "Not at the top")
                        })
                        .setTimestamp();
                    message.reply({ embeds: [embed] });
                } catch (e) {
                    return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.NoDataFound, "API Error")
                }
            })
            .catch(async () => {
                return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.NoDataFound, "API Error")
            });
    }
}

export = command;