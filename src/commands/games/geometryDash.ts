import axios from 'axios';
import { CommandTypes, CommandOptions, CommandsErrorTypes } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';
const GDClient = require("geometry-dash-api");

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

        const GD = new GDClient({
            userName: client.apiKeys.get("GEOMETRYDASHUSER"),
            password: client.apiKeys.get("GEOMETRYDASHPASSWORD"),
        });

        console.log(client.apiKeys.get("GEOMETRYDASHUSER"))
        console.log(client.apiKeys.get("GEOMETRYDASHPASSWORD"))

        const { api } = GD;

        await GD.login();

        const user = await api.users.getByNick(args.join(" "));

        if (!user) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, "User not found.");
        const embed = new EmbedBuilder()
            .setAuthor({
                name: "Geometry Dash",
                iconURL: "https://2.bp.blogspot.com/-Wl1AS-zKl0s/VZVcSDOSckI/AAAAAAAAAJ8/WAFNDi4o_Hc/s1600/GeometryDash.png"
            })
            .setTitle(user.nick)
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
                value: `${user.creatorPoints}`,
                inline: true
            }, {
                name: "<:demons:782320733367566337> | Demons", 
                value: `${user.demons}`, 
                inline: true
            })
            .setFooter({
                text: "Top: " + (`${user.top}` || "Not at the top")
            })
            .setTimestamp();
        message.channel.send({ embeds: [embed] });

    }
}

export = command;