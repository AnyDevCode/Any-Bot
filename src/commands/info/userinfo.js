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
const status = {
  online: "🟢 `Online`",
  dnd: "🔴  `Do Not Disturbe`",
  idle: "🌙 `Idle`",
  offline: "⚫ `Disconnected/Invisible`",
};

function formatDate(template, date) {
  var specs = "YYYY:MM:DD:HH:mm:ss".split(":");
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
  VERIFIED_DEVELOPER: verified_developer,
  HOUSE_BALANCE: house_balance,
  VERIFIED_BOT: verified_bot,
};

module.exports = class ServerInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: "userinfo",
      aliases: ["ui", "user"],
      usage: "userinfo <Mention>",
      description: "Fetches information about a user.",
      examples: ["userinfo @MDC"],
      type: client.types.INFO,
    });
  }
  run(message) {
    const member = message.mentions.members.first() || message.member;

    const embed = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setTitle(`${member.user.username}'s Info`)
      .setThumbnail(
        member.user.displayAvatarURL({ format: "png", dynamic: true })
      )
      .addField("Username", member.user.tag, true)
      .addField("ID", member.user.id, true)
      .addField(
        "Created At",
        formatDate("MM/DD/YYYY, at HH:mm:ss", member.user.createdAt)
      )
      .addField(
        "Joined At",
        formatDate("MM/DD/YYYY, at HH:mm:ss", member.joinedAt),
        true
      )
      .addField(
        "Roles",
        member.roles.cache
          .filter((r) => r.id !== message.guild.id)
          .map((r) => r)
          .join(", ") || "None"
      )
      .addField("Status", status[member.user.presence.status])
      .addField("Bot", member.user.bot ? "Yes" : "No", true)
      .addField(
        "Badges",
        member.user.flags.toArray().length
          ? member.user.flags
              .toArray()
              .map((badge) => badges1[badge])
              .join(" ")
          : "None",
        true
      )
      .addField(
        "Boosts",
        member.premiumSince ? `${member.premiumSince}` : "None",
        true
      )
      .setThumbnail(
        member.user.displayAvatarURL({ format: "png", dynamic: true })
      )
      .setFooter(
        message.member.displayName,
        message.author.displayAvatarURL({ format: "png", dynamic: true })
      )
      .setTimestamp();
    message.channel.send(embed);
  }
};
