const {
  MessageEmbed
} = require("discord.js");

module.exports = {
  name: "guildMemberRemove",
  async execute(member, commands, client) {
    if (member.user === client.user) return;

    client.logger.info(
      `${member.guild.name}: ${member.user.tag} has left the server`
    );

    /** ------------------------------------------------------------------------------------------------
     * MEMBER LOG
     * ------------------------------------------------------------------------------------------------ */
    // Get member log
    const memberLogId = await client.mongodb.settings.selectMemberLogId(member.guild.id);
    const memberLog = member.guild.channels.cache.get(memberLogId);
    if (
      memberLog &&
      memberLog.viewable &&
      memberLog
      .permissionsFor(member.guild.me)
      .has(["SEND_MESSAGES", "EMBED_LINKS"])
    ) {
      const embed = new MessageEmbed()
        .setTitle("Member Left")
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
        .setTimestamp()
        .setColor(member.guild.me.displayHexColor);
      memberLog.send({
        embeds: [embed]
      });
    }

    /** ------------------------------------------------------------------------------------------------
     * FAREWELL MESSAGES
     * ------------------------------------------------------------------------------------------------ */
    // Send farewell message
    let {
      farewellChannelID: farewellChannelId,
      farewellMessage: farewellMessage,
    } = await client.mongodb.settings.selectRow(member.guild.id);
    const farewellChannel = member.guild.channels.cache.get(farewellChannelId);

    let farewellMessageEmbed;

    // Get farewell message
    if (farewellMessage.embed) {
      farewellMessageEmbed = farewellMessage.embed;
    }

    if (farewellMessage.content) {
      farewellMessage = farewellMessage.content;
    }

    if (
      farewellChannel &&
      farewellChannel.viewable &&
      farewellChannel
      .permissionsFor(member.guild.me)
      .has(["SEND_MESSAGES", "EMBED_LINKS"]) &&
      farewellMessage
    ) {
      if (farewellMessageEmbed) {
        for (let key in farewellMessageEmbed) {
          if (typeof key === "string") {
            //Replacing ?member, ?tag, ?username, ?size and ?guild with the actual values
            farewellMessageEmbed[key] = farewellMessageEmbed[key].replace(/\?member/g, member).replace(/\?tag/g, member.user.tag).replace(/\?username/g, member.user.username).replace(/\?size/g, member.guild.memberCount).replace(/\?guild/g, member.guild.name);
          } else if (typeof key === "object") {
            //Replacing ?member, ?tag, ?username, ?size and ?guild with the actual values
            for (let key2 in farewellMessageEmbed[key]) {
              farewellMessageEmbed[key][key2] = farewellMessageEmbed[key][key2].replace(/\?member/g, member).replace(/\?tag/g, member.user.tag).replace(/\?username/g, member.user.username).replace(/\?size/g, member.guild.memberCount).replace(/\?guild/g, member.guild.name);
            }
          } else if (typeof key === "array") {
            //Check if is object
            for (let key2 in farewellMessageEmbed[key]) {
              if (typeof key2 === "object") {
                //Replacing ?member, ?tag, ?username, ?size and ?guild with the actual values
                for (let key3 in farewellMessageEmbed[key][key2]) {
                  farewellMessageEmbed[key][key2][key3] = farewellMessageEmbed[key][key2][key3].replace(/\?member/g, member).replace(/\?tag/g, member.user.tag).replace(/\?username/g, member.user.username).replace(/\?size/g, member.guild.memberCount).replace(/\?guild/g, member.guild.name);
                }
              }
            }
          }
        }
      }

      if (farewellMessage) {
        //Replacing ?member, ?tag, ?username, ?size and ?guild with the actual values
        farewellMessage = farewellMessage.replace(/\?member/g, member).replace(/\?tag/g, member.user.tag).replace(/\?username/g, member.user.username).replace(/\?size/g, member.guild.memberCount).replace(/\?guild/g, member.guild.name);
      }

      let sendmessage = {};

      if (farewellMessageEmbed || farewellMessage) {
        if (farewellMessage) {
          sendmessage.content = farewellMessage;
        }

        if (farewellMessageEmbed) {
          sendmessage.embeds = [farewellMessageEmbed];
        }

        farewellChannel.send(sendmessage);
      }
    }

    /** ------------------------------------------------------------------------------------------------
     * USERS TABLE
     * ------------------------------------------------------------------------------------------------ */
    // Update users table
    await client.mongodb.users.updateCurrentMember(0, member.id, member.guild.id);
    await client.mongodb.users.wipeTotalPoints(member.id, member.guild.id);
  },
};
