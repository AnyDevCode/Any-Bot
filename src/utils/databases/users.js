const mongoose = require("mongoose");

const User = mongoose.model(
  "Users",
  new mongoose.Schema({
    user_id: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
    },
    user_discriminator: {
      type: String,
    },
    guild_id: {
      type: String,
      required: true,
    },
    guild_name: {
      type: String,
    },
    date_joined: {
      type: Date,
      default: Date.now,
    },
    bot: {
      type: Boolean,
      default: false,
    },
    points: {
      type: Number,
      default: 0,
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 0,
    },
    total_points: {
      type: Number,
      default: 0,
    },
    total_xp: {
      type: Number,
      default: 0,
    },
    total_messages: {
      type: Number,
      default: 0,
    },
    total_commands: {
      type: Number,
      default: 0,
    },
    total_reactions: {
      type: Number,
      default: 0,
    },
    total_voice: {
      type: Number,
      default: 0,
    },
    total_stream: {
      type: Number,
      default: 0,
    },
    total_pictures: {
      type: Number,
      default: 0,
    },
    current_member: {
      type: Boolean,
      default: true,
    },
  })
);

module.exports = {
  async insertRow(
    user_id,
    user_name,
    user_discriminator,
    guild_id,
    guild_name,
    date_joined,
    bot,
    points,
    xp,
    level,
    total_points,
    total_xp,
    current_member
  ) {
    //Check if exists
    const user = await User.findOne({ user_id: user_id, guild_id: guild_id });
    if (user) {
      return false;
    } else {
      const user = new User({
        user_id,
        user_name,
        user_discriminator,
        guild_id,
        guild_name,
        date_joined,
        bot,
        points,
        xp,
        level,
        total_points,
        total_xp,
        current_member,
      });
      return user.save();
    }
  },

  async selectRow(userID, guildID) {
    const user = await User.findOne({ user_id: userID, guild_id: guildID });
    if (user) {
      return user;
    } else {
      return false;
    }
  },

  async updateRow(
    user_id,
    user_name,
    user_discriminator,
    guild_id,
    guild_name,
    date_joined,
    bot,
    points,
    xp,
    level,
    total_points,
    total_xp,
    total_messages,
    total_commands,
    total_reactions,
    total_voice,
    total_stream,
    total_pictures,
    current_member
  ) {
    return User.updateOne(
      { user_id, guild_id },
      {
        user_id,
        user_name,
        user_discriminator,
        guild_id,
        guild_name,
        date_joined,
        bot,
        points,
        xp,
        level,
        total_points,
        total_xp,
        total_messages,
        total_commands,
        total_reactions,
        total_voice,
        total_stream,
        total_pictures,
        current_member,
      }
    );
  },

  async updatesqlitetomongo(Array) {
    let allUsers = await this.selectAll();

    for (let i = 0; i < Array.length; i++) {
      try {
        let row = allUsers.find(
          (user) =>
            user.user_id === Array[i].user_id &&
            user.guild_id === Array[i].guild_id
        );

        if (row) {
          await this.updateRow(
            Array[i].user_id,
            Array[i].user_name,
            Array[i].user_discriminator,
            Array[i].guild_id,
            Array[i].guild_name,
            Array[i].date_joined,
            Array[i].bot,
            Array[i].points,
            Array[i].xp,
            Array[i].level,
            Array[i].total_points,
            Array[i].total_xp,
            Array[i].total_messages,
            Array[i].total_commands,
            Array[i].total_reactions,
            Array[i].total_voice,
            Array[i].total_stream,
            Array[i].total_pictures,
            Array[i].current_member
          );
        } else {
          const user = await new User({
            user_id: Array[i].user_id,
            user_name: Array[i].user_name,
            user_discriminator: Array[i].user_discriminator,
            guild_id: Array[i].guild_id,
            guild_name: Array[i].guild_name,
            date_joined: Array[i].date_joined,
            bot: Array[i].bot,
            points: Array[i].points,
            xp: Array[i].xp,
            level: Array[i].level,
            total_points: Array[i].total_points,
            total_xp: Array[i].total_xp,
            total_messages: Array[i].total_messages,
            total_commands: Array[i].total_commands,
            total_reactions: Array[i].total_reactions,
            total_voice: Array[i].total_voice,
            total_stream: Array[i].total_stream,
            total_pictures: Array[i].total_pictures,
            current_member: Array[i].current_member,
          });
          await user.save();
        }
      } catch (e) {
        __Client.logger.error(e);
      }
    }
  },

  async selectAllofGuild(guildID) {
    return await User.find({ guild_id: guildID });
  },

  async selectAll() {
    return await User.find({});
  },

  async selectMissingMembers(guildID) {
    return await User.find({ guild_id: guildID, current_member: false });
  },

  async updateCurrentMember(current_member, userID, guildId) {
    return await User.updateOne(
      { user_id: userID, guild_id: guildId },
      { current_member: current_member }
    );
  },
  async selectCurrentMembers(guildID) {
    return User.find({ guild_id: guildID, current_member: true });
  },

  async selectLeaderboard(guildID) {
    return await User.find({ guild_id: guildID, current_member: true }).sort({
      points: -1,
    });
  },

  async selectPoints(userID, guildID) {
    return await User.findOne({ user_id: userID, guild_id: guildID });
  },

  async wipeAllPoints(guildID) {
    return await User.updateMany({ guild_id: guildID }, { points: 0 });
  },

  async wipeAllTotalPoints(guildID) {
    return await User.updateMany({ guild_id: guildID }, { total_points: 0 });
  },

  async wipePoints(userID, guildID) {
    return await User.updateOne(
      { user_id: userID, guild_id: guildID },
      { points: 0 }
    );
  },

  async wipeTotalPoints(userID, guildID) {
    return await User.updateOne(
      { user_id: userID, guild_id: guildID },
      { total_points: 0 }
    );
  },

  async selectXP(userID, guildID) {
    return (
      (await User.findOne({ user_id: userID, guild_id: guildID }))?.xp ?? 0
    );
  },

  async selectTotalMessages(userID, guildID) {
    return (
      (await User.findOne({ user_id: userID, guild_id: guildID }))
        ?.total_messages ?? 0
    );
  },

  async selectTotalCommands(userID, guildID) {
    return (
      (await User.findOne({ user_id: userID, guild_id: guildID }))
        ?.total_commands ?? 0
    );
  },

  async selectTotalReactions(userID, guildID) {
    return (
      (await User.findOne({ user_id: userID, guild_id: guildID }))
        ?.total_reactions ?? 0
    );
  },

  async selectTotalVoice(userID, guildID) {
    return (
      (await User.findOne({ user_id: userID, guild_id: guildID }))
        ?.total_voice ?? 0
    );
  },

  async selectTotalStream(userID, guildID) {
    return (
      (await User.findOne({ user_id: userID, guild_id: guildID }))
        ?.total_stream ?? 0
    );
  },

  async selectTotalPictures(userID, guildID) {
    return (
      (await User.findOne({ user_id: userID, guild_id: guildID }))
        ?.total_pictures ?? 0
    );
  },

  async selectRank(guildID) {
    return await User.find({ guild_id: guildID, current_member: true }).sort({
      points: -1,
    });
  },

  async selectRankXP(guildID) {
    return await User.find({ guild_id: guildID, current_member: true }).sort({
      xp: -1,
    });
  },

  async updatePoints({ points }, userID, guildID) {
    return await User.findOneAndUpdate(
      { user_id: userID, guild_id: guildID },
      { $inc: { points: points } }
    );
  },

  async updateXP({ xp }, userID, guildID) {
    return await User.findOneAndUpdate(
      { user_id: userID, guild_id: guildID },
      { $inc: { total_xp: xp, xp: xp } }
    );
  },

  async updateTotalMessages(userID, guildID) {
    return await User.findOneAndUpdate(
      { user_id: userID, guild_id: guildID },
      { $inc: { total_messages: 1 } }
    );
  },

  async updateLevel({ level }, userID, guildID) {
    return await User.updateOne(
      { user_id: userID, guild_id: guildID },
      { level: level, xp: 0 }
    );
  },

  async updateTotalCommands(userID, guildID) {
    return await User.findOneAndUpdate(
      { user_id: userID, guild_id: guildID },
      { $inc: { total_commands: 1 } }
    );
  },

  async updateTotalVoice(userID, guildID) {
    return await User.findOneAndUpdate(
      { user_id: userID, guild_id: guildID },
      { $inc: { total_voice: 1 } }
    );
  },

  async updateUser(username, userDiscriminator, userID) {
    return await User.updateOne(
      { user_id: userID },
      { user_name: username, user_discriminator: userDiscriminator }
    );
  },

  async updateTotalReactionsMinus(userID, guildID) {
    return await User.findOneAndUpdate(
      { user_id: userID, guild_id: guildID },
      { $inc: { total_reactions: -1 } }
    );
  },

  async updateTotalImage(userID, guildID) {
    return User.findOneAndUpdate(
      { user_id: userID, guild_id: guildID },
      { $inc: { total_pictures: 1 } }
    );
  },

  async updateGuildName(guildName, guildID) {
    return await User.updateMany(
      { guild_id: guildID },
      { guild_name: guildName }
    );
  },

  async wipeTotalPoints(userID, guildID) {
    return await User.findOneAndUpdate(
      { user_id: userID, guild_id: guildID },
      { points: 0 }
    );
  },

  async deleteGuild(guildID) {
    return await User.deleteMany({ guild_id: guildID });
  },

  async selectTotalPoints(userID, guildID) {
    return (
      (await User.findOne({ user_id: userID, guild_id: guildID }))?.points ?? 0
    );
  },
};
