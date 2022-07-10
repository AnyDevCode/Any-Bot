const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
const {
  discord_employee,
  discord_partner,
  bughunter_level_1,
  bughunter_level_2,
  hypesquad_events,
  house_brilliance,
  house_bravery,
  house_balance,
  early_supporter,
  verified_bot,
  verified_developer,
} = require("../../utils/emojis.json");
const { get } = require("request");
const { user } = require("tiktok-scraper");
const { default: axios } = require("axios");
const status = {
  online: "🟢 `Online`",
  dnd: "🔴  `Do Not Disturbe`",
  idle: "🌙 `Idle`",
  offline: "⚫ `Disconnected/Invisible`",
};

function formatDate(template, date) {
  const specs = "YYYY:MM:DD:HH:mm:ss".split(":");
  date = new Date(date || Date.now() - new Date().getTimezoneOffset() * 6e4);
  return date
    .toISOString()
    .split(/[-:.TZ]/)
    .reduce(function (template, item, i) {
      return template.split(specs[i]).join(item);
    }, template);
}
let badges1 = {
  EARLY_SUPPORTER: early_supporter,
  DISCORD_EMPLOYEE: discord_employee,
  DISCORD_PARTNER: discord_partner,
  HYPESQUAD_EVENTS: hypesquad_events,
  HOUSE_BRAVERY: house_bravery,
  HOUSE_BRILLIANCE: house_brilliance,
  BUGHUNTER_LEVEL_1: bughunter_level_1,
  BUGHUNTER_LEVEL_2: bughunter_level_2,
  EARLY_VERIFIED_BOT_DEVELOPER: verified_developer,
  HOUSE_BALANCE: house_balance,
  VERIFIED_BOT: verified_bot,
};
module.exports = class UserInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: "userinfo",
      aliases: ["ui", "user", "whois"],
      usage: "userinfo <mention/userID>",
      description: "Fetches information about a user.",
      examples: ["userinfo @MDC"],
      type: client.types.INFO,
    });
  }
  async run(message, args) {
    const member =
      this.getMemberFromMention(message, args[0]) ||
      message.guild.members.cache.get(args[0]) ||
      message.member;


    async function getUserBannerUrl(userId) {
      let user = await message.client.api.users(userId).get();
      if (!user.banner) return null;
      if(user.banner.startsWith("a_")){
        //Insert a ".gif" at the end of the banner url
        user.banner = user.banner.replace(user.banner, `${user.banner}.gif`);
      }
      return user.banner ? `https://cdn.discordapp.com/banners/${userId}/${user.banner}?size=4096` : null;
  }


  const banner = await getUserBannerUrl(member.id);

    //Check if the user have a role with "#" in the start
    let color_role
  
    const roles_colors = member.roles.cache
      .filter((r) => r.name.startsWith("#"))
      .map((r) => r.id)
      .join(", ");

      if(roles_colors){
        color_role = roles_colors.split(",")[0];
      }
    
    //Get the user's highest role
    const highestRole = member.roles.highest;

    const embed = new MessageEmbed()
      .setColor(member.displayHexColor)
      .setTitle(`${member.user.username}'s Information`)
      .setThumbnail(
        member.user.displayAvatarURL({ format: "png", dynamic: true })
      )
      .addField("User", `${member.user}`, true)
      
      .addField("ID", `\`${member.user.id}\``, true)
      .addField("Discriminator", `\`#${member.user.discriminator}\``, true)

      .addField("Color role", color_role ? `<@&${color_role}>` : "\`None\`", true)
      .addField("Highest role", highestRole ? `<@&${highestRole.id}>` : "\`None\`", true)
      .addField(
        "Joined At",
        `<t:${Math.round(Date.parse(member.joinedAt)/1000)}:R>`,
        true
      )
      .addField(
        "Created At",
        `<t:${Math.round(Date.parse(member.user.createdAt)/1000)}:R>`,
      )
      .addField(
        "Roles",
        member.roles.cache
          .filter((r) => r.id !== message.guild.id)
          .map((r) => r)
          .join(", ") || "None"
      )
      .addField(
        "Badges",
        (member.user.flags
          ? member.user.flags.toArray().length
            ? member.user.flags
                .toArray()
                .map((badge) => badges1[badge])
                .join(" ")
            : "None"
          : "None"),
        true
      )
      .addField(
        "Boosts?",
        member.premiumSince ? "\`Yes\`" : "\`No\`",
        true
      )
      .setThumbnail(
        member.user.displayAvatarURL({ format: "png", dynamic: true })
      )
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setImage(user.banner ? user.banner : (banner ? banner : null))
      .setTimestamp();
    message.channel.send({ embeds: [embed] });
  }
};
