const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();
const { abbreviateNumber } = require("js-abbreviation-number");

module.exports = {
  name: "ready",
  once: true,
  async execute(client, slashes) {
    const activities = [
      { name: `>help`, type: "LISTENING" },
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
    }, //Every 10 minutes
    600000);

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
          );
          client.logger.info("Guild slash commands updated!");
        }
      } catch (e) {
        if (e) console.log(e);
        client.logger.error("Failed to update slash commands!");
      }
    })();

    client.logger.info("Updating database and scheduling jobs...");
    for await (const guild of client.guilds.cache.values()) {
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
      await client.mongodb.settings.insertRow(
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

      if (process.argv.slice(2)[0] === "--update") {
        const database = await client.db.settings.selectRow.get(guild.id);

        const crownMessage = [
          {
            type: "message",
            data: { text: database.crown_message },
          },
        ];

        const welcomeMessage = [
          {
            type: "message",
            data: { text: database.welcome_message },
          },
        ];

        const farewellMessage = [
          {
            type: "message",
            data: { text: database.farewell_message },
          },
        ];

        await client.mongodb.settings.updatesqlitetomongo(
          database.guild_id,
          database.guild_name,
          database.prefix,
          database.system_channel_id,
          database.starboard_channel_id,
          database.admin_role_id,
          database.mod_role_id,
          database.mute_role_id,
          database.auto_role_id,
          database.auto_kick,
          database.auto_ban,
          database.random_color,
          database.mod_channel_ids,
          database.disabled_commands,
          database.mod_log_id,
          database.member_log_id,
          database.nickname_log_id,
          database.role_log_id,
          database.message_edit_log_id,
          database.message_delete_log_id,
          database.verification_role_id,
          database.verification_channel_id,
          database.verification_message,
          database.verification_message_id,
          0,
          database.welcome_channel_id,
          welcomeMessage,
          database.farewell_channel_id,
          farewellMessage,
          database.point_tracking,
          database.message_points,
          database.command_points,
          database.voice_points,
          database.xp_tracking,
          database.message_xp,
          database.command_xp,
          database.voice_xp,
          database.xp_message_action,
          database.xp_channel_id,
          database.crown_role_id,
          database.crown_channel_id,
          crownMessage,
          database.crown_schedule
        );

        const newMembers = [];

        for (const member of guild.members.cache.values()) {
          const memberDatabase = client.db.users.selectRow.get(
            member.id,
            guild.id
          );

          newMembers.push({
            user_id: member.id,
            user_name: member.user.username,
            user_discriminator: member.user.discriminator,
            guild_id: guild.id,
            guild_name: guild.name,
            date_joined: member.joinedAt ? member.joinedAt.toString() : null,
            bot: member.user.bot ? true : false,
            points: memberDatabase ? memberDatabase.points : 0,
            xp: memberDatabase ? memberDatabase.xp : 0,
            level: memberDatabase ? memberDatabase.level : 0,
            total_points: memberDatabase ? memberDatabase.total_points : 0,
            total_xp: memberDatabase ? memberDatabase.total_xp : 0,
            total_messages: memberDatabase ? memberDatabase.total_messages : 0,
            total_commands: memberDatabase ? memberDatabase.total_commands : 0,
            total_reactions: memberDatabase
              ? memberDatabase.total_reactions
              : 0,
            total_voice: memberDatabase ? memberDatabase.total_voice : 0,
            total_streams: memberDatabase ? memberDatabase.total_streams : 0,
            total_pictures: memberDatabase ? memberDatabase.total_pictures : 0,
            current_member: member.roles.cache.has(guild.id) ? true : false,
          });


          client.logger.info(
            `${member.user.username} has been added to the database!`
          );
        }

        await client.mongodb.users.updatesqlitetomongo(newMembers);

      }

      // Update users table
      // guild.members.cache.forEach((member) => {
      //     client.db.users.insertRow.run(
      //         member.id,
      //         member.user.username,
      //         member.user.discriminator,
      //         guild.id,
      //         guild.name,
      //         member.joinedAt.toString(),
      //         member.user.bot ? 1 : 0
      //     );
      // });

      //Get all users in the guild
      const dbUsers = await client.mongodb.users.selectAllofGuild(guild.id);

      //Check if the user is in the database
      for await (const member of guild.members.cache.values()) {
        const user = dbUsers.find((u) => u.user_id === member.id);

        if (user) {
          //Check if have the same data
          if (
            user.user_name !== member.user.username ||
            user.user_discriminator !== member.user.discriminator ||
            guild.name !== user.guild_name
          ) {
            //Update the user
            await client.mongodb.users.updateRow(
              member.id,
              member.user.username,
              member.user.discriminator,
              guild.id,
              guild.name,
              member.joinedAt
                ? member.joinedAt.toString()
                : Date.now().toString(),
              member.user.bot ? 1 : 0,
              user.points,
              user.xp,
              user.level,
              user.total_points,
              user.total_xp,
              user.total_messages,
              user.total_commands,
              user.total_reactions,
              user.total_voice,
              user.total_stream,
              user.total_pictures,
              user.current_member
            );

            continue;
          } else {
            //No run more and continue with the next member
            continue;
          }
        }

        //If the user is not in the database, add them
        await client.mongodb.users.insertRow(
          member.id,
          member.user.username,
          member.user.discriminator,
          guild.id,
          guild.name,
          member.joinedAt ? member.joinedAt.toString() : Date.now().toString(),
          member.user.bot ? 1 : 0
        );

        client.logger.info(
          `${member.user.username} has been added to the database!`
        );
      }

      // for await (const member of guild.members.cache.values()) {
      //     await client.mongodb.users.insertRow(
      //         member.id,
      //         member.user.username,
      //         member.user.discriminator,
      //         guild.id,
      //         guild.name,
      //         member.joinedAt ? member.joinedAt.toString() : (Date.now()).toString(),
      //         member.user.bot ? 1 : 0
      //     );

      // }

      /** ------------------------------------------------------------------------------------------------
       * CHECK DATABASE
       * ------------------------------------------------------------------------------------------------ */
      // If member left
      if (!client.shard) {
        const currentMember = await client.mongodb.users.selectCurrentMembers(guild.id)
        for (const user of currentMember) {
          if (!guild.members.cache.has(user.user_id)) {
            client.mongodb.users.updateCurrentMember(0, user.user_id, guild.id);
          }
        }
      }

      // If member joined
      const missingMember = await client.mongodb.users.selectMissingMembers(guild.id);

      for (const user of missingMember) {
        if (guild.members.cache.has(user.user_id)) {
          client.mongodb.users.updateCurrentMember(1, user.user_id, guild.id);
        }
      }

      /** ------------------------------------------------------------------------------------------------
       * VERIFICATION
       * ------------------------------------------------------------------------------------------------ */
      // Fetch verification message
      const {
        verificationChannelID: verificationChannelId,
        verificationMessageID: verificationMessageId,
      } = await client.mongodb.settings.selectRow(guild.id);
      const verificationChannel = guild.channels.cache.get(
        verificationChannelId
      );
      if (verificationChannel && verificationChannel.viewable) {
        try {
          await verificationChannel.messages.fetch(verificationMessageId);
        } catch (e) {}
      }

      /** ------------------------------------------------------------------------------------------------
       * CROWN ROLE
       * ------------------------------------------------------------------------------------------------ */
      // Schedule crown role rotation
      await client.utils.scheduleCrown(client, guild);
    }

    // Remove left guilds
    if (!client.shard) {
      const dbGuilds = await client.mongodb.settings.selectGuilds();
      const guilds = Array.from(client.guilds.cache.keys());

      //Create a const leftGuilds if the guilds in the dbGuilds array are not in the guilds array

      const leftGuilds = dbGuilds.filter((g1) => !guilds.includes(g1.guildID));

      for (const guild of leftGuilds) {
        await client.mongodb.settings.deleteGuild(guild.guildID);

        client.logger.info(`Any Bot has left ${guild.guild_name}`);
      }
    }

    if (process.argv.slice(2)[0] === "--update") {
      // Terminate the process
      process.exit(0);
    }

    // Finish message
    client.logger.info(`Ready to serve ${client.guilds.cache.size} guilds, in ${client.channels.cache.size} channels of ${client.users.cache.size} users.`);
  },
};
