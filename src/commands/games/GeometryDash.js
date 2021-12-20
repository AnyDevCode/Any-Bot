const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
const GDClient = require("geometry-dash-api"); // Primero, instalar la api, npm i geometry-dash-api

module.exports = class GeometryDashCommand extends Command {
  constructor(client) {
    super(client, {
      name: "geometrydash",
      aliases: ["gduser"],
      usage: "gduser <name>",
      description: "Show information about any GeometryDash user.",
      type: client.types.GAMES,
      examples: ["geometrydash Guillester"],
    });
  }
  async run(message, args) {
    if (!args[0])
      return this.sendErrorMessage(message, 0, "Please enter a username.");

    const GD = new GDClient({
      userName: message.client.apiKeys.geometrydash.user,
      password: message.client.apiKeys.geometrydash.password,
    });

    const { api } = GD;

    await GD.login();

    const user = await api.users.getByNick(args.join(" "));

    if (!user) return this.sendErrorMessage(message, 0, "User not found.");
    const embed = new MessageEmbed()
      .setAuthor(
        "Geometry Dash",
        "http://2.bp.blogspot.com/-Wl1AS-zKl0s/VZVcSDOSckI/AAAAAAAAAJ8/WAFNDi4o_Hc/s1600/GeometryDash.png"
      )
      .setTitle(user.nick)
      .setColor(message.guild.me.displayHexColor)
      .addField("<:stars:782318695790673931> | Stars", user.stars, true)
      .addField("<:coins:782316329935699968> | Coins", user.coins, true)
      .addField(
        "<:user_coins:782317393668997150> | User Coins",
        user.userCoins,
        true
      )
      .addField("<:diamond:782319420206088274> | Diamonds", user.diamonds, true)
      .addField(
        "<:creator_points:782320177889935410> | Creator Points",
        user.creatorPoints,
        true
      )
      .addField("<:demons:782320733367566337> | Demons", user.demons, true)
      .setFooter("Top: " + (user.top || "Not at the top"))
      .setTimestamp();
    message.channel.send(embed);
  }
};
