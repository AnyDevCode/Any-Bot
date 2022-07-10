const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
require("moment");

module.exports = class WarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: "warndelete",
      aliases: ["delwarn", "deletewarn", "removewarn"],
      usage: "warndelete <Warn ID> [reason]",
      description: "Delete a specific warn of a user.",
      type: client.types.MOD,
      clientPermissions: [
        "SEND_MESSAGES",
        "EMBED_LINKS",
        "KICK_MEMBERS",
        "MANAGE_MESSAGES",
      ],
      userPermissions: ["KICK_MEMBERS", "MANAGE_MESSAGES"],
      examples: ["warndelete 123 Erronious behaviour", "warndelete 123"],
    });
  }
  async run(message, args) {
    if (!args[0])
      return this.sendErrorMessage(message, 0, "Please provide a warn ID.");

    const warn = await message.client.mongodb.warns.getWarnById(args[0]);

    if (!warn)
      return this.sendErrorMessage(
        message,
        0,
        "That warn with this ID does not exist."
      );

    const member = message.guild.members.cache.get(warn.userID);

    if (warn.warnID === message.member.id)
      return await this.sendErrorMessage(
        message,
        0,
        "You cannot delete a warn from yourself"
      );
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return await this.sendErrorMessage(
        message,
        0,
        "You cannot delete a warn from someone with an equal or higher role"
      );

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "`None`";
    if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

    const warnscount = parseInt(
      (await message.client.mongodb.warns.selectUserWarnsCount(
        member.id,
        message.guild.id
      ))
    );

    await message.client.mongodb.warns.deleteWarn(parseInt(args[0]));

    const embed = new MessageEmbed()
      .setTitle("Delete Warn Member")
      .setDescription(`${member} has had a warn deleted.`)
      .addField("Moderator", `${message.member}`, true)
      .addField("Member", `${member}`, true)
      .addField("Warn Count", `\`${warnscount - 1}\``, true)
      .addField("Reason", reason)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({ embeds: [embed] });
    message.client.logger.info(
      `${message.guild.name}: ${message.author.tag} unwarned ${member.user.tag}`
    );

    // Update mod log
    this.sendModLogMessage(message, reason, {
      Member: member,
      "Warn Count": `\`${warnscount}\``,
    });
  }
};
