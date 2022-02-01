const Command = require("../Command.js");
const {MessageEmbed} = require("discord.js");
const osu = require('node-osu');
const {abbreviateNumber} = require("js-abbreviation-number");
module.exports = class OsuPlayerCommand extends Command {
    constructor(client) {
        super(client, {
            name: "osuplayer",
            aliases: ["osuplayer", "osupl", "osuplayerinfo", "osuplinfo"],
            usage: "osuplayer <mode> <username>",
            description: "Gets information about an osu! player.",
            examples: ["osuplayer osu sakamata1", "osuplayer mania ElHiriam"],
            type: client.types.GAMES,
        });
    }

    async run(message, args) {
        if (!args[0])
            return this.sendErrorMessage(
                message,
                0,
                "Please enter an osu! mode. (osu, taiko, catch, mania)",
            );
        if (!["osu", "taiko", "catch", "mania"].includes(args[0].toLowerCase()))
            return this.sendErrorMessage(
                message,
                0,
                "Please enter an osu! mode. (osu, taiko, catch, mania)",
            );
        let mode = args[0].toLowerCase();
        //transform string in number m?: 0 | 1 | 2 | 3 – Mode (0 = osu!, 1 = Taiko, 2 = CtB, 3 = osu!mania)
        mode = mode === "osu" ? 0 : mode === "taiko" ? 1 : mode === "catch" ? 2 : 3;
        // Username is the second and more argument
        const username = args.slice(1).join(" ");
        if (!username)
            return this.sendErrorMessage(
                message,
                0,
                "Please enter an osu! username.",
            );
        const osuApi = new osu.Api(message.client.apiKeys.osuapikey, {
            notFoundAsError: true,
            completeScores: false,
            parseNumeric: false,
        });

        let player = await osuApi.apiCall('/get_user', {u: username, m: mode});
        if (!player[0])
            return this.sendErrorMessage(
                message,
                0,
                "Could not find an osu! player with that name."
            );

        player = player[0];

        const {seconds_to_time} = message.client.utils;

        const embed = new MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setAuthor(`osu! Player: ${player.username}`, "https://i.imgur.com/qKkE2qH.png", `https://osu.ppy.sh/users/${player.user_id}`)
            .setThumbnail(`https://a.ppy.sh/${player.user_id}`)
            .addField("Level", Math.round(player.level), true)
            .addField("PP", abbreviateNumber(player.pp_raw), true)
            .addField("Rank", abbreviateNumber(player.pp_rank), true)
            .addField("Accuracy", Math.round(player.accuracy) + "%", true)
            .addField("Play Count", abbreviateNumber(player.playcount), true)
            .addField("Total Score", abbreviateNumber(player.ranked_score), true)
            .addField("Total Hits", abbreviateNumber(parseInt(player.count300) + parseInt(player.count100) + parseInt(player.count50)), true)
            .addField("300s", abbreviateNumber(player.count300), true)
            .addField("100s", abbreviateNumber(player.count100), true)
            .addField("50s", abbreviateNumber(player.count50), true)
            .addField("Country", player.country, true)
            .addField("Join Date", player.join_date, true)
            .addField("Play Time", seconds_to_time(player.total_seconds_played), true)
        return message.channel.send(embed);
    }
};
