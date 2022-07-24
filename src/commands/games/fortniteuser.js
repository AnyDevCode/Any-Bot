const Command = require("../Command.js");
const Discord = require("discord.js");
const canvas = require("discord-canvas");
const stats = new canvas.FortniteStats();

module.exports = class FortniteUserCommand extends Command {
  constructor(client) {
    super(client, {
      name: "fortniteuser",
      aliases: ["ftuser"],
      usage: "fortniteuser <psn/xbl/pc> <name>",
      description: "Shows Fortnite user information.",
      type: client.types.GAMES,
      examples: ["fortniteuser pc Ninja"],
    });
  }
  async run(message, args) {
    const apiKey = message.client.apiKeys.fortniteApi;

    const user = args.slice(1).join(" ");
    const platform = args[0];

    if (!user)
      return this.sendErrorMessage(message, 0, "Please enter a username.");
    if (!platform)
      return this.sendErrorMessage(message, 0, "Please enter a platform.");
    if (platform !== "pc" && platform !== "xbl" && platform !== "psn")
      return this.sendErrorMessage(
        message,
        0,
        "Please enter a valid platform (pc/xbl/psn)."
      );

    let image = await stats
      .setToken(apiKey)
      .setUser(user)
      .setPlatform(platform)
      .toAttachment();

    if (!image) return this.sendErrorMessage(message, 0, "User not found.");

    let attachment = new Discord.MessageAttachment(
      image.toBuffer(),
      "FortniteStats.png"
    );

    message.channel.send({files: [attachment]});
  }
};
