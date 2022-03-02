const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();
const { abbreviateNumber } = require("js-abbreviation-number");

module.exports = {
  name: "ready",
  once: true,
  async execute(client, slashes) {
    const activities = [
      { name: `!help`, type: "LISTENING" },
      { name: "for you", type: "LISTENING" },
    ];

    // Update presence
    client.user.setActivity(activities[0].name, { type: activities[0].type });

    let activity = 1;

    setInterval(() => {
      activities[2] = {
        name: `${client.guilds.cache.size} servers`,
        type: "WATCHING",
      }; // Update server count
      activities[3] = {
        name: `${client.users.cache.size} users`,
        type: "WATCHING",
      }; // Update user count
      activities[4] = {
        name: `with ${client.commands.size} commands`,
        type: "PLAYING",
      }; // Update command count
      if (activity >= activities.length) activity = 0;
      client.user.setActivity(activities[activity].name, {
        type: activities[activity].type,
      });

      activity++;
    }, 30000);

    setInterval(() => {
      //Update name of a channel
      const guilds_channel = client.channels.cache.get(
        client.statsChannels.guilds_channel
      );
      let guilds = client.guilds.cache.size;
      //Create a variable with the number closest to guilds that is a power of 100
      let closest_guilds = Math.pow(10, Math.floor(Math.log10(guilds))) * 10;
      guilds_channel.setName(
        `『🏁』 Guilds: ${client.guilds.cache.size}/${closest_guilds}`
      );

      //Update name of a channel
      const users_channel = client.channels.cache.get(
        client.statsChannels.users_channel
      );
      let users = client.users.cache.size;
      //Create a variable with the number closest to users that is a power of 10000
      let closest_users = Math.pow(10, Math.floor(Math.log10(users))) * 10;
      users_channel.setName(
        `『🧑』 Users: ${abbreviateNumber(
          client.users.cache.size
        )}/${abbreviateNumber(closest_users)}`
      );
    }, 1000 * 60 * 5);

    client.logger.info(`Logged in as ${client.user.tag}!`);
    client.logger.info(
      `Ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`
    );

    const CLIENT_ID = client.user.id;

    const rest = new REST({
      version: "10",
    }).setToken(process.env.TOKEN);

    await (async () => {
      try {
        if (process.env.ENV === "production") {
          await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: slashes,
          });
          client.logger.info("Global slash commands updated!");
        } else {
          await rest.put(
          Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID),
              {
                body: slashes,
              }
        )
          ;
          client.logger.info("Guild slash commands updated!");
        }
      } catch (e) {
        if (e) console.log(e);
        client.logger.error("Failed to update slash commands!");
      }
    })();

    client.logger.info("Updating database and scheduling jobs...");
    for (const guild of client.guilds.cache.values()) {
      /** ------------------------------------------------------------------------------------------------
       * FIND SETTINGS
       * ------------------------------------------------------------------------------------------------ */
      // Find mod log
      const modLog = guild.channels.cache.find(
        (c) =>
          c.name.replace("-", "").replace("s", "") === "modlog" ||
          c.name.replace("-", "").replace("s", "") === "moderatorlog"
      );

      // Find admin and mod roles
      const adminRole = guild.roles.cache.find(
        (r) =>
          r.name.toLowerCase() === "admin" ||
          r.name.toLowerCase() === "administrator"
      );
      const modRole = guild.roles.cache.find(
        (r) =>
          r.name.toLowerCase() === "mod" || r.name.toLowerCase() === "moderator"
      );
      const muteRole = guild.roles.cache.find(
        (r) => r.name.toLowerCase() === "muted"
      );
      const crownRole = guild.roles.cache.find((r) => r.name === "The Crown");

      /** ------------------------------------------------------------------------------------------------
       * UPDATE TABLES
       * ------------------------------------------------------------------------------------------------ */
      // Update settings table
      await client.db.settings.insertRow.run(
        guild.id,
        guild.name,
        guild.systemChannelID, // Default channel
        guild.systemChannelID, // Welcome channel
        guild.systemChannelID, // Farewell channel
        null, // Crown Channel
        null, //XP Channel
        modLog ? modLog.id : null,
        adminRole ? adminRole.id : null,
        modRole ? modRole.id : null,
        muteRole ? muteRole.id : null,
        crownRole ? crownRole.id : null
      );

      // Update users table
      guild.members.cache.forEach((member) => {
        client.db.users.insertRow.run(
          member.id,
          member.user.username,
          member.user.discriminator,
          guild.id,
          guild.name,
          member.joinedAt.toString(),
          member.user.bot ? 1 : 0
        );
      });

      /** ------------------------------------------------------------------------------------------------
       * CHECK DATABASE
       * ------------------------------------------------------------------------------------------------ */
      // If member left
      if (!client.shard) {
        const currentMemberIds = client.db.users.selectCurrentMembers
          .all(guild.id)
          .map((row) => row.user_id);
        for (const id of currentMemberIds) {
          if (!guild.members.cache.has(id)) {
            client.db.users.updateCurrentMember.run(0, id, guild.id);
          }
        }
      }

      // If member joined
      const missingMemberIds = client.db.users.selectMissingMembers
        .all(guild.id)
        .map((row) => row.user_id);
      for (const id of missingMemberIds) {
        if (guild.members.cache.has(id))
          client.db.users.updateCurrentMember.run(1, id, guild.id);
      }

      /** ------------------------------------------------------------------------------------------------
       * VERIFICATION
       * ------------------------------------------------------------------------------------------------ */
      // Fetch verification message
      const {
        verification_channel_id: verificationChannelId,
        verification_message_id: verificationMessageId,
      } = client.db.settings.selectVerification.get(guild.id);
      const verificationChannel = guild.channels.cache.get(
        verificationChannelId
      );
      if (verificationChannel && verificationChannel.viewable) {
        try {
          await verificationChannel.messages.fetch(verificationMessageId);
        } catch (err) {
          // Message was deleted
          client.logger.error(err);
        }
      }

      /** ------------------------------------------------------------------------------------------------
       * CROWN ROLE
       * ------------------------------------------------------------------------------------------------ */
      // Schedule crown role rotation
      client.utils.scheduleCrown(client, guild);
    }

    // Remove left guilds
    if (!client.shard) {
      const dbGuilds = await client.db.settings.selectGuilds.all();
      const guilds = Array.from(client.guilds.cache.keys());
      const leftGuilds = dbGuilds.filter(
        (g1) => !guilds.some((g2) => g1.guildID === g2.id)
      );
      for (const guild of leftGuilds) {
        await client.mongodb.settings.deleteGuild(guild.guildID);
        client.db.users.deleteGuild.run(guild.guild_id);

        client.logger.info(`Any Bot has left ${guild.guild_name}`);
      }
    }
  },
};
