module.exports = async (client) => {

  const activities = [
    { name: `ab.help`, type: "LISTENING"},
    { name: 'for you', type: 'LISTENING' }
  ];

  // Update presence
  client.user.setPresence({ status: 'online', activity: activities[0] });

  let activity = 1;

  let active_music = false;
  //Update every 1 minute
  setInterval(() => {
    let queue = client.queue();

    //Check if the queue is empty
    if(queue.size === 0) {
      //If it is, set the activity to the first one
      active_music = false
    }

    //If the queue is not empty
    if(queue.size > 0) {
      //Set the activity to the first one
      active_music = true
    }

    //If the music is active, choose a random music of a random queue
    if(active_music) {
      let random_queue = Math.floor(Math.random() * queue.size)
      if (random_queue === 0) {
        random_queue = 1
      }
      //Map to an array
      let queue_array = Array.from(queue)

      activities[4] = { name: queue_array[random_queue - 1][1].songs[0].title, type: 'LISTENING' }
    } else {
      activities.splice(4, 1)
    }
  }, 60000)

  // Update activity every 30 seconds
  setInterval(() => {
    activities[2] = { name: `${client.guilds.cache.size} servers`, type: 'WATCHING' }; // Update server count
    activities[3] = { name: `${client.users.cache.size} users`, type: 'WATCHING' }; // Update user count
    if (activity > activities.length) activity = 0;
    client.user.setActivity(activities[activity]);
    activity++;
  }, 30000);

  client.logger.info('Updating database and scheduling jobs...');
  for (const guild of client.guilds.cache.values()) {

    /** ------------------------------------------------------------------------------------------------
     * FIND SETTINGS
     * ------------------------------------------------------------------------------------------------ */
    // Find mod log
    const modLog = guild.channels.cache.find(c => c.name.replace('-', '').replace('s', '') === 'modlog' ||
      c.name.replace('-', '').replace('s', '') === 'moderatorlog');

    // Find admin and mod roles
    const adminRole =
      guild.roles.cache.find(r => r.name.toLowerCase() === 'admin' || r.name.toLowerCase() === 'administrator');
    const modRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'mod' || r.name.toLowerCase() === 'moderator');
    const muteRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
    const crownRole = guild.roles.cache.find(r => r.name === 'The Crown');

    /** ------------------------------------------------------------------------------------------------
     * UPDATE TABLES
     * ------------------------------------------------------------------------------------------------ */
    // Check database
    const data = await client.mongodb.settings.selectRow(guild.id);
    // Update settings table
    await client.db.settings.insertRow.run(
      guild.id,
      guild.name,
      data.systemChannelID || guild.systemChannelID, // Default channel
      data.welcomeChannelID || guild.systemChannelID, // Welcome channel
      data.farewellChannelID  || guild.systemChannelID, // Farewell channel
      data.crownChannelID || null,  // Crown Channel
      data.xpChannelID || null, //XP Channel
      data.modLogID || (modLog ? modLog.id : null),
      data.adminRoleID || (adminRole ? adminRole.id : null),
      data.modRoleID || (modRole ? modRole.id : null),
      data.mutedRoleID || (muteRole ? muteRole.id : null),
      data.crownRoleID || (crownRole ? crownRole.id : null)
    );

    await client.mongodb.settings.insertRow(
      guild.id,
      guild.name,
      data.systemChannelID || guild.systemChannelID, // Default channel
      data.welcomeChannelID || guild.systemChannelID, // Welcome channel
      data.farewellChannelID  || guild.systemChannelID, // Farewell channel
      data.crownChannelID || null,  // Crown Channel
      data.xpChannelID || null, //XP Channel
      data.modLogID || (modLog ? modLog.id : null),
      data.adminRoleID || (adminRole ? adminRole.id : null),
      data.modRoleID || (modRole ? modRole.id : null),
      data.mutedRoleID || (muteRole ? muteRole.id : null),
      data.crownRoleID || (crownRole ? crownRole.id : null)
    );

    // Update users table
    guild.members.cache.forEach(member => {
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
    if(!client.shard){
      const currentMemberIds = client.db.users.selectCurrentMembers.all(guild.id).map(row => row.user_id);
      for (const id of currentMemberIds) {
        if (!guild.members.cache.has(id)) {
          client.db.users.updateCurrentMember.run(0, id, guild.id);
        }
      }
    }

    // If member joined
    const missingMemberIds = client.db.users.selectMissingMembers.all(guild.id).map(row => row.user_id);
    for (const id of missingMemberIds) {
      if (guild.members.cache.has(id)) client.db.users.updateCurrentMember.run(1, id, guild.id);
    }

    /** ------------------------------------------------------------------------------------------------
     * VERIFICATION
     * ------------------------------------------------------------------------------------------------ */
    // Fetch verification message
    const { verification_channel_id: verificationChannelId, verification_message_id: verificationMessageId } =
      client.db.settings.selectVerification.get(guild.id);
    const verificationChannel = guild.channels.cache.get(verificationChannelId);
    if (verificationChannel && verificationChannel.viewable) {
      try {
        await verificationChannel.messages.fetch(verificationMessageId);
      } catch (err) { // Message was deleted
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
  if(!client.shard){
    const dbGuilds = await client.mongodb.settings.selectGuilds();
    const guilds = client.guilds.cache.array();
    const leftGuilds = dbGuilds.filter(g1 => !guilds.some(g2 => g1.guildID === g2.id));
    for (const guild of leftGuilds) {
      await client.mongodb.settings.deleteGuild(guild.guildID);
      client.db.users.deleteGuild.run(guild.guild_id);

      client.logger.info(`Any Bot has left ${guild.guild_name}`);
    }
  }

  client.logger.info('Any Bot is now online');
  client.logger.info(`Any Bot is running on ${client.guilds.cache.size} server(s)`);
};
