const { MessageEmbed } = require("discord.js");

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
          icon_url: member.guild.iconURL({ dynamic: true }),
        })
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`${member} (**${member.user.tag}**)`)
        .setTimestamp()
        .setColor(member.guild.me.displayHexColor);
      memberLog.send({ embeds: [embed] });
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

    if(farewellMessage[0].data.text){
      farewellMessage = farewellMessage[0].data.text;
    } else {
      farewellMessage = null;
    }

    if (
      farewellChannel &&
      farewellChannel.viewable &&
      farewellChannel
        .permissionsFor(member.guild.me)
        .has(["SEND_MESSAGES", "EMBED_LINKS"]) &&
      farewellMessage
    ) {
      farewellMessage = farewellMessage
        .replace(/`?\?member`?/g, member) // Member mention substitution
        .replace(/`?\?username`?/g, member.user.username) // Username substitution
        .replace(/`?\?tag`?/g, member.user.tag) // Tag substitution
        .replace(/`?\?size`?/g, member.guild.members.cache.size); // Guild size substitution
      farewellChannel.send({
        embeds: [
          new MessageEmbed()
            .setDescription(farewellMessage)
            .setColor(member.guild.me.displayHexColor),
        ],
      });
    }

    /** ------------------------------------------------------------------------------------------------
     * USERS TABLE
     * ------------------------------------------------------------------------------------------------ */
    // Update users table
    client.db.users.updateCurrentMember.run(0, member.id, member.guild.id);
    client.db.users.wipeTotalPoints.run(member.id, member.guild.id);
  },
};
