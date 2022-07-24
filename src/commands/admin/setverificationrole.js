const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
const { success, verify } = require("../../utils/emojis.json");
const { oneLine, stripIndent } = require("common-tags");

module.exports = class SetVerificationRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: "setverificationrole",
      aliases: ["setvr", "svr"],
      usage: "setverificationrole <role mention/ID>",
      description: oneLine`
        Sets the role Any Bot will give members who are verified.
        Provide no role to clear the current \`verification role\`.
        A \`verification role\`, a \`verification channel\`, 
        and a \`verification message\` must be set to enable server verification.
      `,
      type: client.types.ADMIN,
      clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS", "MANAGE_ROLES"],
      userPermissions: ["MANAGE_GUILD"],
      examples: ["setverificationrole @Verified"],
    });
  }
  async run(message, args) {
    let {
      verificationRoleID: verificationRoleId,
      verificationChannelID: verificationChannelId,
      verificationMessage: verificationMessage,
      verificationMessageID: verificationMessageId,
    } = await message.client.mongodb.settings.selectRow(message.guild.id);
    const oldVerificationRole =
      message.guild.roles.cache.get(verificationRoleId) || "`None`";
    const verificationChannel = message.guild.channels.cache.get(
      verificationChannelId
    );

    // Get status
    const oldStatus = message.client.utils.getStatus(
      verificationRoleId && verificationChannelId && verificationMessage
    );

    // Trim message
    if (verificationMessage && verificationMessage.length > 1024)
      verificationMessage = verificationMessage.slice(0, 1021) + "...";

    const embed = new MessageEmbed()
      .setTitle("Settings: `Verification`")
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(
        `The \`verification role\` was successfully updated. ${success}`
      )
      .addField(
        "Channel",
        verificationChannel ? `${verificationChannel}` : "`None`",
        true
      )
      .addField(
        "Message",
        verificationMessage ? `${verificationMessage}` : "`None`"
      )
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear role
    if (args.length === 0) {
      await message.client.mongodb.settings.updateVerificationRoleId(
        null,
        message.guild.id
      );
      await message.client.mongodb.settings.updateVerificationMessageId(
        null,
        message.guild.id
      );

      if (verificationChannel && verificationMessageId) {
        try {
          await verificationChannel.messages.delete(verificationMessageId);
        } catch (err) {
          // Message was deleted
          message.client.logger.error(err);
        }
      }

      // Update status
      const status = "disabled";
      const statusUpdate =
        oldStatus !== status
          ? `\`${oldStatus}\` ➔ \`${status}\``
          : `\`${oldStatus}\``;

      return message.channel.send({
        embeds: [
          embed
            .spliceFields(0, 0, {
              name: "Role",
              value: `${oldVerificationRole} ➔ \`None\``,
              inline: true,
            })
            .spliceFields(2, 0, {
              name: "Status",
              value: statusUpdate,
              inline: true,
            }),
        ],
      });
    }

    // Update role
    const verificationRole =
      this.getRoleFromMention(message, args[0]) ||
      message.guild.roles.cache.get(args[0]);
    if (!verificationRole)
      return this.sendErrorMessage(
        message,
        0,
        "Please mention a role or provide a valid role ID"
      );
    await message.client.mongodb.settings.updateVerificationRoleId(
      verificationRole.id,
      message.guild.id
    );

    // Update status
    const status = message.client.utils.getStatus(
      verificationRole && verificationChannel && verificationMessage
    );
    const statusUpdate =
      oldStatus !== status
        ? `\`${oldStatus}\` ➔ \`${status}\``
        : `\`${oldStatus}\``;

    message.channel.send({
      embeds: [
        embed
          .spliceFields(0, 0, {
            name: "Role",
            value: `${oldVerificationRole} ➔ ${verificationRole}`,
            inline: true,
          })
          .spliceFields(2, 0, {
            name: "Status",
            value: statusUpdate,
            inline: true,
          }),
      ],
    });

    // Update verification
    if (status === "enabled") {
      if (verificationChannel.viewable) {
        let oldMessageId, msg;
        try {
          oldMessageId = await verificationChannel.messages.fetch(verificationMessageId);
        } catch (err) {
          //Send a new message
          let msg2 = await verificationChannel.send("Verification");
          oldMessageId = msg2.id;
        }
        if (oldMessageId) {
          try {
            msg = await oldMessageId.edit({
              embeds: [
              new MessageEmbed()
              .setDescription(verificationMessage)
              .setColor(message.guild.me.displayHexColor)
              ]
            });
            await msg.react(verify.split(":")[2].slice(0, -1));
            await message.client.mongodb.settings.updateVerificationMessageId(
              msg.id,
              message.guild.id
            );
          } catch (err) {
        msg = await verificationChannel.send({
          embeds: [
          new MessageEmbed()
          .setDescription(verificationMessage)
          .setColor(message.guild.me.displayHexColor)
          ]
        }
        );
        await msg.react(verify.split(":")[2].slice(0, -1));
        await message.client.mongodb.settings.updateVerificationMessageId(
          msg.id,
          message.guild.id
        );
        }
      } else {
        msg = await verificationChannel.send({
          embeds: [
          new MessageEmbed()
          .setDescription(verificationMessage)
          .setColor(message.guild.me.displayHexColor)
          ]
        }
        );
        await msg.react(verify.split(":")[2].slice(0, -1));
        await message.client.mongodb.settings.updateVerificationMessageId(
          msg.id,
          message.guild.id
        );
      }
        

      } else {
        return message.client.sendSystemErrorMessage(
          message.guild,
          "verification",
          stripIndent`
          Unable to send verification message, please ensure I have permission to access the verification channel
        `
        );
      }
    }
  }
};
