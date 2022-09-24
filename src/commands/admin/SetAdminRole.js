// Dependencies:
const {
  MessageEmbed
} = require("discord.js");
const {
  success
} = require("../../utils/emojis.json");
// Command Require:
const Command = require("../Command.js");

// Command Definition:
module.exports = class SetAdminRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: "setadminrole",
      aliases: ["setar", "sar"],
      usage: "setadminrole <role mention/ID>",
      description: "Sets the `admin role` for your server. Provide no role to clear the current `admin role`.",
      type: client.types.ADMIN,
      userPermissions: ["MANAGE_GUILD"],
      examples: ["setadminrole @Admin"],
    });
  }

  // Command Code:
  async run(message, args) {

    const lang_text = this.getLanguage();

    // Check role:
    const adminRoleId = await message.client.mongodb.settings.selectAdminRoleId(
      message.guild.id
    );
    const oldAdminRole =
      message.guild.roles.cache.find((r) => r.id === adminRoleId) || lang_text.fields.none;

    // Create embed:
    const embed = new MessageEmbed()
      .setTitle(lang_text.fields.title)
      .setThumbnail(message.guild.iconURL({
        dynamic: true
      }))
      .setDescription(lang_text.fields.description.replace('%{success}', success))
      .setFooter({
        text: `${message.member.displayName}`,
        iconURL: message.author.displayAvatarURL({
          dynamic: true
        }),
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      await message.client.mongodb.settings.updateAdminRoleId(
        null,
        message.guild.id
      );
      return message.channel.send({
        embeds: [embed.addField(lang_text.messages.admin_role, lang_text.messages.role_to_none.replace('%{oldAdminRole}', oldAdminRole))]
      });
    }

    // Update role
    const adminRole =
      this.getRoleFromMention(message, args[0]) ||
      message.guild.roles.cache.get(args[0]);
    if (!adminRole)
      return this.sendErrorMessage(
        message,
        0,
        lang_text.errors.invalid_role_or_id
      );
    await message.client.mongodb.settings.updateAdminRoleId(
      adminRole.id,
      message.guild.id
    );
    return message.channel.send({
      embeds: [embed.addField(lang_text.fields.title, `${oldAdminRole} ➔ ${adminRole}`)],
    });
  }
};
