const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
const util = require("minecraft-server-util");
const request = require("request");

module.exports = class MinecraftServerCommand extends Command {
  constructor(client) {
    super(client, {
      name: "mcserver",
      aliases: ["mcsv"],
      usage: "mcserver <ip> [port]",
      description: "It tells you the information of a Minecraft server.",
      examples: ["mcserver mc.revenant.us", "mcserver mc.revenant.us 25565"],
      type: client.types.GAMES,
    });
  }
  async run(message, args) {
    if (!args[0])
      return this.sendErrorMessage(
        message,
        0,
        "Please enter an IP of a Minecraft server."
      );
    let port = args[1];
    if (!port) {
      port = `25565`;
    }

    let pingURL = `https://api.minetools.eu/ping/${args[0]}`;

    try{

    request(pingURL, async function (err, resp, body) {
      if (err) return this.sendErrorMessage(message, 0, "A error has occured.");
      body = JSON.parse(body);
      if (body.error)
        return this.sendErrorMessage(message, 0, "Server not found.");

      let motd = `http://status.mclive.eu/MinecraftServer/${args[0]}/${port}/banner.png`;

      util
        .status(`${args[0]}`, { port: parseInt(port)
        })
        .then((response) => {
          const Embed = new MessageEmbed()
            .setTitle("Server Status")
            .addField("Server IP", `${response.host}`, true)
            .addField("Server Version", `${response.version}`, true)
            .addField("Latency", `${body.latency.toFixed(2)} ms`, true)
            .addField(
              "Online Players",
              `${response.onlinePlayers}` + "/" + `${response.maxPlayers}`,
                true
            )
              .setImage(motd)
              .setThumbnail(
                  "https://cdn.glitch.com/402b9099-0636-457a-8ffb-faf65c857490%2F1.png?v=1585792839856"
              )
              .setColor(message.guild.me.displayHexColor);

          message.channel.send({embeds: [Embed]});
        })
          .catch(() => {
            message.channel.send({
              content: "I can't find that server."
            });
          });
    });
  } catch (e) {
    this.sendErrorMessage(message, 0, "Server not found.");
  }
  }
};
