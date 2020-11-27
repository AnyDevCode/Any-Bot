const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
let features = {
        ANIMATED_ICON: "Animated Icon",
        BANNER: "Banner",
        COMMERCE: "Commerce",
        COMMUNITY: "Community",
        DISCOVERABLE: "Discoverable",
        FEATURABLE: "Featurable",
        INVITE_SPLASH: "Invite splash",
        PUBLIC: "Public",
        NEWS: "News",
        PARTNERED: "Partnered",
        VANITY_URL: "Vanity URL",
        VERIFIED: "Verified",
        VIP_REGIONS: "V.I.P. Region",
        RELAY_ENABLED: "Relay enabled",
        WELCOME_SCREEN_ENABLED: "Welcome screen enabled"
    };

    let level = { 
        0: "None",
        1: "Level 1",
        2: "Level 2",
        3: "Level 3"
    };

module.exports = class ServerBoostCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'serverboost',
      usage: 'serverboos',
      description: 'Information on Server Boost.',
      type: client.types.INFO
    });
  }
  run(message) {

    var server = message.guild 

    const embed = new MessageEmbed()
    .setColor(message.guild.me.displayHexColor)
    .setAuthor("Boost status on: " + server.name)
    .setThumbnail(!server.splashURL({ size: 2048, format: "jpg" })
        ? server.iconURL({ size: 2048, format: "jpg" })
        : server.splashURL({ size: 2048, format: "jpg" }))
    .addFields({
        name: "Level of Boost", value: level[server.premiumTier],
        inline: true
    })
    .addFields({
        name: "Members booting", value: server.premiumSubscriptionCount === 0 ? "none boosts"
            : `${server.premiumSubscriptionCount} ${
            server.premiumSubscriptionCount === 1 ? "member" : "members"}`,
        inline: true
    })
    .addFields({
        name: "Server benefits", value: `${server.features.length <= 0
            ? "none"
            : `\`${server.features.map(f => features[f]).join("`, `")}\``
            }`
        , inline: false
    })
    .setImage(server.bannerURL({ size: 2048, format: "jpg" }));
message.channel.send(embed);
  }
};
