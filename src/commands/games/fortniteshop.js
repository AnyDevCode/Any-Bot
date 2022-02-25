const Command = require("../Command.js");
const Discord = require("discord.js");
const swiftcord = require("swiftcord");
module.exports = class FortniteShopCommand extends Command {
  constructor(client) {
    super(client, {
      name: "fortniteshop",
      aliases: ["ftshop"],
      description: "It says that there is that day in the Fortnite item store.",
      type: client.types.GAMES,
    });
  }

  async run(message) {
    const apiKey = message.client.apiKeys.fortniteshopApi;
    const canva = new swiftcord.Canvas();
    const image = await canva.Fortnite().setKey(apiKey).toAttachment();
    let attachment = new Discord.MessageAttachment(image, "shop.png");

    const embed = new Discord.MessageEmbed()
      .setTitle("Fortnite Shop")
      .setImage('attachment://shop.png')
      .setFooter({ text: message.member.displayName, icon_url: message.author.displayAvatarURL({ dynamic: true })})
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    message.channel.send({ embeds: [embed], files: [attachment] });
  }
};
