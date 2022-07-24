module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState, commands, client) {
    // Check member
    if (oldState.member !== newState.member) return;
    const member = newState.member;

    // Get points
    const { pointTracking: pointTracking, voicePoints: voicePoints } =
      await client.mongodb.settings.selectPoints(member.guild.id);

    //Get xp
    let {
      xpTracking: xpTracking,
      voiceXP: xpPoints,
      xpMessageAction: xp_message_action,
      xpChannelID: xp_channel_id,
    } = await client.mongodb.settings.selectXP(member.guild.id);

    let min_xp_voice = Math.floor(xpPoints - 2);
    let max_xp_voice = Math.floor(xpPoints + 2);
    if (min_xp_voice < 0) min_xp_voice = 0;

    xpPoints =
      Math.floor(Math.random() * (max_xp_voice - min_xp_voice + 1)) +
      min_xp_voice;

    if (!xpTracking) return;

    let { level, xp } = await client.mongodb.users.selectRow(
      member.id,
      member.guild.id
    );

    if (!level) level = 0;

    level = level.level;

    // Set IDs
    const oldId = oldState.channelID;
    const newId = newState.channelID;
    const afkId = member.guild.afkChannelID;

    if (oldId === newId) return;
    else if ((!oldId || oldId === afkId) && newId && newId !== afkId) {
      // Joining channel that is not AFK
      member.interval = setInterval(async () => {
        let requiredXP = 50 * Math.pow(level, 2);

        await client.mongodb.users.updateTotalVoice(
          { total_voice: 1 },
          member.id,
          member.guild.id
        );

        if (pointTracking || voicePoints !== 0) {
          await client.mongodb.users.updatePoints(
            { points: voicePoints },
            member.id,
            member.guild.id
          );
        }

        if (xpTracking) {
          await client.mongodb.users.updateXP(
            { xp: xpPoints },
            member.id,
            member.guild.id
          );

          if (xp + xpPoints >= requiredXP) {
            await client.mongodb.users.updateLevel(
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
        }
      }, 60 * 1000);
    } else if (oldId && ((oldId !== afkId && !newId) || newId === afkId)) {
      clearInterval(member.interval);
    }
  },
};
