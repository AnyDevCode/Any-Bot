const Command = require("../Command.js");
const {MessageAttachment} = require("discord.js");
const canvas = require("discord-canvas");
rankCardCanvas = new canvas.RankCard();

module.exports = class RankCommand extends Command {
  constructor(client) {
    super(client, {
      name: "rank",
      usage: "rank <user mention/ID>",
      description:
          "Fetches a user's  xp. If no user is given, your own xp will be displayed.",
      type: client.types.LEVELS,
      examples: ["rank @MDC"],
    });
  }
  async run(message, args) {
    // Check if user is in a voice channel
    if (message.member.voice.channel)
      return this.sendErrorMessage(
          message,
          1,
          "Because a limitation of the API, you can't use this command in a voice channel."
      );
    const member =
        this.getMemberFromMention(message, args[0]) ||
        message.guild.members.cache.get(args[0]) ||
        message.member;
    const xp = message.client.db.users.selectXP
        .pluck()
        .get(member.id, message.guild.id);
    const level = message.client.db.users.selectLevel
        .pluck()
        .get(member.id, message.guild.id);
    let total_messages = message.client.db.users.selectTotalMessages
        .pluck()
        .get(member.id, message.guild.id);
    let total_commands = message.client.db.users.selectTotalCommands
        .pluck()
        .get(member.id, message.guild.id);
    let total_reactions = message.client.db.users.selectTotalReactions
        .pluck()
        .get(member.id, message.guild.id);
    let total_voice = message.client.db.users.selectTotalVoice
        .pluck()
        .get(member.id, message.guild.id);
    let total_pictures = message.client.db.users.selectTotalPictures
        .pluck()
        .get(member.id, message.guild.id);
    const requiredXP = 50 * Math.pow(level, 2);
    const leaderboard = message.client.db.users.selectRank.all(
        message.guild.id
    );
    const position = leaderboard.map((row) => row.user_id).indexOf(member.id);
    let boosts = member.premiumSince;
    const username = member.user.username;

    let mod_badge_or_admin_role = null;

    let moderator_role =
        message.client.db.settings.selectModRoleId
            .pluck()
            .get(message.guild.id) || "";
    let admin_role =
        message.client.db.settings.selectAdminRoleId
            .pluck()
            .get(message.guild.id) || "";

    if (member.roles.cache.has(moderator_role)) {
      mod_badge_or_admin_role = "https://i.imgur.com/tpaksRh.png";
    }
    if (member.roles.cache.has(admin_role)) {
      mod_badge_or_admin_role = "https://i.imgur.com/984Lqf8.png";
    }

    if (total_messages == null) total_messages = 0;
    else {
      if (total_messages < 100) total_messages = null;
      if (1000 > total_messages && total_messages >= 100)
        total_messages = "bronze";
      if (2500 > total_messages && total_messages >= 1000)
        total_messages = "silver";
      if (10000 > total_messages && total_messages >= 2500)
        total_messages = "gold";
      if (total_messages >= 10000) total_messages = "diamond";
    }
    if (total_commands == null) total_commands = 0;
    else {
      if (total_commands < 10) total_commands = null;
      if (100 > total_commands && total_commands >= 10)
        total_commands = "bronze";
      if (500 > total_commands && total_commands >= 100)
        total_commands = "silver";
      if (1000 > total_commands && total_commands >= 500)
        total_commands = "gold";
      if (total_commands >= 1000) total_commands = "diamond";
    }
    if (total_reactions == null) total_reactions = 0;
    else {
      if (total_reactions < 10) total_reactions = null;
      if (50 > total_reactions && total_reactions >= 10)
        total_reactions = "bronze";
      if (150 > total_reactions && total_reactions >= 50)
        total_reactions = "silver";
      if (300 > total_reactions && total_reactions >= 150)
        total_reactions = "gold";
      if (total_reactions >= 300) total_reactions = "diamond";
    }
    if (total_voice == null) total_voice = 0;
    else {
      if (total_voice < 60) total_voice = null;
      if (600 > total_voice && total_voice >= 60) total_voice = "bronze";
      if (3000 > total_voice && total_voice >= 600) total_voice = "silver";
      if (12000 > total_voice && total_voice >= 3000) total_voice = "gold";
      if (total_voice >= 12000) total_voice = "diamond";
    }
    if (total_pictures == null) total_pictures = 0;
    else {
      if (total_pictures < 10) total_pictures = null;
      if (50 > total_pictures && total_pictures >= 10)
        total_pictures = "bronze";
      if (100 > total_pictures && total_pictures >= 50)
        total_pictures = "silver";
      if (200 > total_pictures && total_pictures >= 100)
        total_pictures = "gold";
      if (total_pictures >= 200) total_pictures = "diamond";
    }
    if (boosts == null) boosts = null;
    else {
      if (3 > boosts > 0) boosts = "bronze";
      if (6 > boosts >= 3) boosts = "silver";
      if (10 > boosts >= 6) boosts = "gold";
      if (boosts >= 10) boosts = "diamond";
      if (total_messages < 100) total_messages = null;
    }

    let image = await rankCardCanvas
        .setAvatar(member.user.displayAvatarURL({format: "png", dynamic: true}))
        .setXP("current", xp)
        .setXP("needed", requiredXP)
        .setLevel(level)
        .setRank(position + 1)
        .setUsername(member.displayName)
        .setRankName(username)
        .setColor("level-box", "#d7588f")
        .setText(
            "needed-xp",
            "{current}/{needed} for next rank. {latest} remaining!"
        )
        .setRadius(20)
        .setAddon("reputation", false)
        .setBackground("https://i.imgur.com/rLArvSC.png")
        .setBadge(1, total_messages)
        .setBadge(2, total_voice)
        .setBadge(4, total_pictures)
        .setBadge(5, total_reactions)
        .setBadge(6, mod_badge_or_admin_role)
        .setBadge(7, boosts)
        .setBadge(9, total_commands)
        .toAttachment();

    let attachment = new MessageAttachment(image.toBuffer(), "rank.png");

    return message.channel.send(attachment);
  }
};
