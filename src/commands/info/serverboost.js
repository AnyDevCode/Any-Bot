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
        MEMBER_VERIFICATION_GATE_ENABLED: "Member verification gate enabled",
        MONETIZATION_ENABLED: "Monetization enabled",
        MORE_STICKERS: "More stickers",
        PREVIEW_ENABLED: "Preview enabled",
        PRIVATE_THREADS: "Private threads",
        ROLE_ICONS: "Role icons",
        SEVEN_DAY_THREAD_ARCHIVE: "Seven day thread archive",
        THREE_DAY_THREAD_ARCHIVE: "Three day thread archive",
        TICKETED_EVENTS_ENABLED: "Ticketed events enabled",
        PUBLIC: "Public",
        NEWS: "News",
        PARTNERED: "Partnered",
        VANITY_URL: "Vanity URL",
        VERIFIED: "Verified",
        VIP_REGIONS: "V.I.P. Region",
        RELAY_ENABLED: "Relay enabled",
        WELCOME_SCREEN_ENABLED: "Welcome screen enabled",
        THREADS_ENABLED: "Threads enabled",
        ENABLED_DISCOVERABLE_BEFORE: "Enabled discoverable before",
        NEW_THREAD_PERMISSIONS: "New thread permissions",
    };

    let level = { 
        "NONE": "None",
        "TIER_1": "Level 1",
        "TIER_2": "Level 2",
        "TIER_3": "Level 3"
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
    .setAuthor({
        name: "Boost status on: " + `${server.name}`
    })
    .setThumbnail(!server.splashURL({ size: 2048, format: "jpg" })
        ? server.iconURL({ size: 2048, format: "jpg" })
        : server.splashURL({ size: 2048, format: "jpg" }))
    .addFields({
        name: "Level of Boost", value: `${level[server.premiumTier]}`,
        inline: true
    })
    .addFields({
        name: "Members boosting", value: server.premiumSubscriptionCount === 0 ? "None boosts"
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
message.channel.send({embeds: [embed]});
  }
};
