const {
  MessageEmbed
} = require("discord.js");
const moment = require("moment");
const {
  stripIndent
} = require("common-tags");

module.exports = {
  name: "guildMemberAdd",
  async execute(member, commands, client) {
    client.logger.info(
      `${member.guild.name}: ${member.user.tag} has joined the server`
    );

    /** ------------------------------------------------------------------------------------------------
     * MEMBER LOG
     * ------------------------------------------------------------------------------------------------ */
    // Get member log
    const memberLogId = await client.mongodb.settings.selectMemberLogId(
      member.guild.id
    );
    const memberLog = member.guild.channels.cache.get(memberLogId);
    if (
      memberLog &&
      memberLog.viewable &&
      memberLog
      .permissionsFor(member.guild.me)
      .has(["SEND_MESSAGES", "EMBED_LINKS"])
    ) {
      const embed = new MessageEmbed()
        .setTitle("Member Joined")
        .setAuthor({
          name: member.guild.name,
          icon_url: member.guild.iconURL({
            dynamic: true
          }),
        })
        .setThumbnail(member.user.displayAvatarURL({
          dynamic: true
        }))
        .setDescription(`${member} (**${member.user.tag}**)`)
        .addField(
          "Account created on",
          moment(member.user.createdAt).format("dddd, MMMM Do YYYY")
        )
        .setTimestamp()
        .setColor(member.guild.me.displayHexColor);
      memberLog.send({
        embeds: [embed]
      });
    }

    /** ------------------------------------------------------------------------------------------------
     * AUTO ROLE
     * ------------------------------------------------------------------------------------------------ */
    // Get auto role
    const autoRoleId = await client.mongodb.settings.selectAutoRoleId(
      member.guild.id
    );
    const autoRole = member.guild.roles.cache.get(autoRoleId);
    if (autoRole) {
      try {
        await member.roles.add(autoRole);
      } catch (err) {
        await client.sendSystemErrorMessage(
          member.guild,
          "auto role",
          stripIndent `
              Unable to assign auto role, please check the role hierarchy and ensure I have the Manage Roles permission
            `,
          err.message
        );
      }
    }

    /** ------------------------------------------------------------------------------------------------
     * WELCOME MESSAGES
     * ------------------------------------------------------------------------------------------------ */
    // Get welcome channel
    let {
      welcomeChannelID: welcomeChannelId,
      welcomeMessage: welcomeMessage
    } =
    await client.mongodb.settings.selectRow(member.guild.id);
    const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

    let welcomeMessageEmbed;

    // Get welcome message
    if (welcomeMessage.embed) {
      welcomeMessageEmbed = welcomeMessage.embed;
    }

    if (welcomeMessage.content) {
      welcomeMessage = welcomeMessage.content;
    }

    // Send welcome message
    if (
      welcomeChannel &&
      welcomeChannel.viewable &&
      welcomeChannel
      .permissionsFor(member.guild.me)
      .has(["SEND_MESSAGES", "EMBED_LINKS"]) &&
      welcomeMessage
    ) {
      if (welcomeMessageEmbed) {
        for (let key in welcomeMessageEmbed) {
          if (typeof key === "string") {
            //Replacing ?member, ?tag, ?username, ?size and ?guild with the actual values
            welcomeMessageEmbed[key] = welcomeMessageEmbed[key].replace(/\?member/g, member).replace(/\?tag/g, member.user.tag).replace(/\?username/g, member.user.username).replace(/\?size/g, member.guild.memberCount).replace(/\?guild/g, member.guild.name);
          } else if (typeof key === "object") {
            //Replacing ?member, ?tag, ?username, ?size and ?guild with the actual values
            for (let key2 in welcomeMessageEmbed[key]) {
              welcomeMessageEmbed[key][key2] = welcomeMessageEmbed[key][key2].replace(/\?member/g, member).replace(/\?tag/g, member.user.tag).replace(/\?username/g, member.user.username).replace(/\?size/g, member.guild.memberCount).replace(/\?guild/g, member.guild.name);
            }
          } else if (typeof key === "array") {
            //Check if is object
            for (let key2 in welcomeMessageEmbed[key]) {
              if (typeof key2 === "object") {
                //Replacing ?member, ?tag, ?username, ?size and ?guild with the actual values
                for (let key3 in welcomeMessageEmbed[key][key2]) {
                  welcomeMessageEmbed[key][key2][key3] = welcomeMessageEmbed[key][key2][key3].replace(/\?member/g, member).replace(/\?tag/g, member.user.tag).replace(/\?username/g, member.user.username).replace(/\?size/g, member.guild.memberCount).replace(/\?guild/g, member.guild.name);
                }
              }
            }
          }
        }
      }

      if (welcomeMessage) {
        //Replacing ?member, ?tag, ?username, ?size and ?guild with the actual values
        welcomeMessage = welcomeMessage.replace(/\?member/g, member).replace(/\?tag/g, member.user.tag).replace(/\?username/g, member.user.username).replace(/\?size/g, member.guild.memberCount).replace(/\?guild/g, member.guild.name);
      }

      let sendmessage = {}

      if (welcomeMessage || welcomeMessageEmbed) {
        if (welcomeMessage) {
          sendmessage.content = welcomeMessage;
        }

        if (welcomeMessageEmbed) {
          sendmessage.embeds = [welcomeMessageEmbed];
        }

        welcomeChannel.send(sendmessage);
      }


    }

    /** ------------------------------------------------------------------------------------------------
     * RANDOM COLOR
     * ------------------------------------------------------------------------------------------------ */
    // Assign random color
    const randomColor = await client.mongodb.settings.selectRandomColor(
      member.guild.id
    );
    if (randomColor) {
      const colors = member.guild.roles.cache
        .filter((c) => c.name.startsWith("#"))
        .array();

      // Check length
      if (colors.length > 0) {
        const color = colors[Math.floor(Math.random() * colors.length)]; // Get color
        try {
          await member.roles.add(color);
        } catch (err) {
          client.sendSystemErrorMessage(
            member.guild,
            "random color",
            stripIndent `
                Unable to assign random color, please check the role hierarchy and ensure I have the Manage Roles permission
              `,
            err.message
          );
        }
      }
    }

    /** ------------------------------------------------------------------------------------------------
     * USERS TABLE
     * ------------------------------------------------------------------------------------------------ */
    // Update users table
    await client.mongodb.users.insertRow(
      member.id,
      member.username,
      member.discriminator,
      member.guild.id,
      member.guild.name,
      member.joinedAt.toString(),
      member.user.bot ? 1 : 0
    );

    // If member already in users table
    let missingMemberIds = Array.from(
      await client.mongodb.users.selectMissingMembers(member.guild.id)
    );

    if (missingMemberIds.includes(member.id)) {
      await client.mongodb.users.updateCurrentMember(
        1,
        member.id,
        member.guild.id
      );
    }
  },
};

module.exports.help = {
  name: "guildMemberAdd",
  description: "Triggered when a member joins the server",
  type: "event",
  usage: "guildMemberAdd",
  example: "guildMemberAdd",
};

module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User",
};

module.exports.settings = {
  disabled: false,
  category: "events",
};

module.exports.info = {
  name: "guildMemberAdd",
  description: "Triggered when a member joins the server",
  type: "event",
  category: "events",
};

module.exports.permissions = {}
