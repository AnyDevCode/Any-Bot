module.exports = {
  name: "voiceStatusUpdate",
  async execute(oldState, newState, commands, client) {
    // Check member
    if (oldState.member !== newState.member) return;
    const member = newState.member;

    // Get points
    const { point_tracking: pointTracking, voice_points: voicePoints } =
      client.db.settings.selectPoints.get(member.guild.id);
    if (!pointTracking || voicePoints === 0) return;

    //Get xp
    let {
      xp_tracking: xpTracking,
      voice_xp: xpPoints,
      xp_message_action: xp_message_action,
      xp_channel_id: xp_channel_id,
    } = client.db.settings.selectXP.get(member.guild.id);

    let min_xp_voice = Math.floor(xpPoints - 2);
    let max_xp_voice = Math.floor(xpPoints + 2);
    if (min_xp_voice < 0) min_xp_voice = 0;

    xpPoints =
      Math.floor(Math.random() * (max_xp_voice - min_xp_voice + 1)) +
      min_xp_voice;

    if (!xpTracking) return;

    let level = client.db.users.selectLevel.get(member.id, member.guild.id);

    level = level.level;

    // Set IDs
    const oldId = oldState.channelID;
    const newId = newState.channelID;
    const afkId = member.guild.afkChannelID;

    if (oldId === newId) return
    else if ((!oldId || oldId === afkId) && newId && newId !== afkId) {
      // Joining channel that is not AFK
      member.interval = setInterval(() => {
        let requiredXP = 50 * Math.pow(level, 2);
        client.db.users.updatePoints.run(
          { points: voicePoints },
          member.id,
          member.guild.id
        );
        client.db.users.updateTotalVoice.run(
          { total_voice: 1 },
          member.id,
          member.guild.id
        );
        client.db.users.updateXP.run(
          { xp: xpPoints },
          member.id,
          member.guild.id
        );
        if (
          client.db.users.selectXP.get(member.id, member.guild.id) >= requiredXP
        ) {
          client.db.users.updateLevel.run(
            { level: level + 1 },
            member.id,
            member.guild.id
          );
          if (xp_message_action && xp_channel_id) {
            const xpChannel = member.guild.channels.cache.get(xp_channel_id);
            if (xpChannel) {
              xpChannel.send({
                contend: `${member} has leveled up to level ${level + 1}!`,
              });
            }
          }
        }
      }, 60000);

      // Make interval every 30 seconds to check if the bot is in the voice channel
      // If it is not, then clear the interval
      member.interval2 = setInterval(() => {
        let queue = client.queue();
        const server_queue = queue.get(member.guild.id);
        // Client leaves channel
        if (server_queue) {
          //Check if the bot is not in the voice channel
          if (server_queue.voice_channel.members.size <= 1) {
            server_queue.voice_channel.leave();
            queue.delete(member.guild.id);
            clearInterval(member.interval2);
          }
        }
      }, 30000);
    } else if (oldId && ((oldId !== afkId && !newId) || newId === afkId)) {
      // Leaving voice chat or joining AFK
      // If bot is in the same channel as the user, bot leaves the channel
      let usersCount = member.guild.members.cache.filter(
        (m) => m.voice.channelID === oldId
      ).size;
      if (usersCount === 1) {
        let queue = client.queue();
        const server_queue = queue.get(member.guild.id);
        // Client leaves channel
        if (member.guild.me.voice.channel) {
          const stop_song = async (message, server_queue) =>
            client.utils.stop_song(message, server_queue);

          await stop_song(member, server_queue);
          member.guild.me.voice.channel.leave();
        }
      }

      clearInterval(member.interval);
    }
  },
};
