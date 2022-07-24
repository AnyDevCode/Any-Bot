const { SlashCommandBuilder } = require("@discordjs/builders");
const Slash = require("../Slash.js");
const { MessageEmbed } = require("discord.js");
const { fail } = require(__basedir + "/src/utils/emojis.json");
const { PermissionFlagsBits } = require("discord-api-types/v10");
module.exports = class BanSlash extends Slash {
  constructor(client) {
    super(client, {
      name: "ban",
      data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user from the server.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to ban")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for the ban")
            .setRequired(false)
        )
        .setDMPermission(false),

      aliases: ["b"],
    });
  }

  async run(interaction) {
    let options = interaction.options;

    let reason = options.getString("reason");
    if (reason === null) {
      reason = "No reason given.";
    }

    let member = options.getUser("user");

    const banUser = interaction.guild.members.cache.get(member.id);

    if (!banUser)
      return interaction.reply(`${fail} I couldn't find that user.`);

    if (banUser === interaction.member)
      return interaction.reply(`${fail} You can't ban yourself.`);
    if (
      banUser.roles.highest.position >=
      interaction.member.roles.highest.position
    )
      return interaction.reply(
        `${fail} You can't ban someone with an equal or higher role.`
      );
    if (!banUser.bannable)
      return interaction.reply(`${fail} That user is not bannable.`);

    if (!reason) reason = "`None`";
    if (reason.length > 1024) reason = reason.slice(0, 1021) + "...";

    await banUser.ban({ reason: reason });

    const embed = new MessageEmbed()
      .setTitle("Ban Member")
      .setDescription(`${banUser} was successfully banned.`)
      .addField("Moderator", `${interaction.member}`, true)
      .addField("Member", `${banUser}`, true)
      .addField("Reason", `${reason}`)
      .setTimestamp()
      .setColor(interaction.guild.me.displayHexColor);

    interaction.reply({ embeds: [embed] });

    interaction.client.logger.info(
      `${interaction.guild.name}: ${interaction.member.tag} banned ${banUser.user.tag}`
    );

    return this.sendModLogMessage(interaction, reason, { Member: banUser });
  }
};
