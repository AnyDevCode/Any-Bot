import mongoose from "mongoose";

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

export = {
  async insertRow(
    user_id: any,
    user_name: any,
    user_discriminator: any,
    guild_id: any,
    guild_name: any,
    date_joined: any,
    bot: any,
    points: any,
    xp: any,
    level: any,
    total_points: any,
    total_xp: any,
    current_member: any
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

  async selectRow(userID: any, guildID: any) {
    const user = await User.findOne({ user_id: userID, guild_id: guildID });
    if (user) {
      return user;
    } else {
      return false;
    }
  },

  async updateRow(
    user_id: any,
    user_name: any,
    user_discriminator: any,
    guild_id: any,
    guild_name: any,
    date_joined: any,
    bot: any,
    points: any,
    xp: any,
    level: any,
    total_points: any,
    total_xp: any,
    total_messages: any,
    total_commands: any,
    total_reactions: any,
    total_voice: any,
    total_stream: any,
    total_pictures: any,
    current_member: any
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

  async updatesqlitetomongo(Array: string | any[]) {
    let allUsers = await this.selectAllofGuild(Array[0].guild_id);

    for (let i = 0; i < Array.length; i++) {
      try {
        let row = allUsers.find(
          (user: { user_id: any; guild_id: any; }) =>
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
        console.log(e);
      }
    }
  },

  async selectAllofGuild(guildID: any) {
    //Return all users of a guild, only the user_id and guild_id of all users
    return User.find({ guild_id: guildID, current_member: true }).lean();
  },

  async selectAll() {
    return await User.find({});
  },

  async selectMissingMembers(guildID: any) {
    return await User.find({ guild_id: guildID, current_member: false });
  },

  async updateCurrentMember(current_member: any, userID: any, guildId: any) {
    return await User.updateOne(
      { user_id: userID, guild_id: guildId },
      { current_member: current_member }
    );
  },
  async selectCurrentMembers(guildID: any) {
    return User.find({ guild_id: guildID, current_member: true });
  },

  async selectLeaderboard(guildID: any) {
    return await User.find({ guild_id: guildID, current_member: true }).sort({
      points: -1,
    });
  },

  async selectPoints(userID: any, guildID: any) {
    return (await User.findOne({ user_id: userID, guild_id: guildID }))?.points;
  },

  async wipeAllPoints(guildID: any) {
    return await User.updateMany({ guild_id: guildID }, { points: 0 });
  },

  async wipeAllTotalPoints(guildID: any) {
    return await User.updateMany({ guild_id: guildID }, { total_points: 0 });
  },

  async wipePoints(userID: any, guildID: any) {
    return await User.updateOne(
      { user_id: userID, guild_id: guildID },
      { points: 0 }
    );
  },

  async wipeTotalPoints(userID: any, guildID: any) {
    return await User.updateOne(
      { user_id: userID, guild_id: guildID },
      { total_points: 0 }
    );
  },

  async selectXP(userID: any, guildID: any) {
    return (
      (await User.findOne({ user_id: userID, guild_id: guildID }))?.xp ?? 0
    );
  },

  async selectTotalMessages(userID: any, guildID: any) {
    return (
      (await User.findOne({ user_id: userID, guild_id: guildID }))
        ?.total_messages ?? 0
    );
  },

  async selectTotalCommands(userID: any, guildID: any) {
    return (
      (await User.findOne({ user_id: userID, guild_id: guildID }))
        ?.total_commands ?? 0
    );
  },

  async selectTotalReactions(userID: any, guildID: any) {
    return (
      (await User.findOne({ user_id: userID, guild_id: guildID }))
        ?.total_reactions ?? 0
    );
  },

  async selectTotalVoice(userID: any, guildID: any) {
    return (
      (await User.findOne({ user_id: userID, guild_id: guildID }))
        ?.total_voice ?? 0
    );
  },

  async selectTotalStream(userID: any, guildID: any) {
    return (
      (await User.findOne({ user_id: userID, guild_id: guildID }))
        ?.total_stream ?? 0
    );
  },

  async selectTotalPictures(userID: any, guildID: any) {
    return (
      (await User.findOne({ user_id: userID, guild_id: guildID }))
        ?.total_pictures ?? 0
    );
  },

  async selectRank(guildID: any) {
    return await User.find({ guild_id: guildID, current_member: true }).sort({
      points: -1,
    });
  },

  async selectRankXP(guildID: any) {
    return await User.find({ guild_id: guildID, current_member: true }).sort({
      total_xp: -1,
    });
  },

  async updatePoints({ points }: any, userID: any, guildID: any) {
    return await User.findOneAndUpdate(
      { user_id: userID, guild_id: guildID },
      { $inc: { points: points } }
    );
  },

  async updateXP({ xp }: any, userID: any, guildID: any) {
    return await User.findOneAndUpdate(
      { user_id: userID, guild_id: guildID },
      { $inc: { total_xp: xp, xp: xp } }
    );
  },

  async updateTotalMessages(userID: any, guildID: any) {
    return await User.findOneAndUpdate(
      { user_id: userID, guild_id: guildID },
      { $inc: { total_messages: 1 } }
    );
  },

  async updateLevel({ level }: any, userID: any, guildID: any) {
    return await User.updateOne(
      { user_id: userID, guild_id: guildID },
      { level: level, xp: 0 }
    );
  },

  async updateTotalCommands(userID: any, guildID: any) {
    return await User.findOneAndUpdate(
      { user_id: userID, guild_id: guildID },
      { $inc: { total_commands: 1 } }
    );
  },

  async updateTotalVoice(userID: any, guildID: any) {
    return await User.findOneAndUpdate(
      { user_id: userID, guild_id: guildID },
      { $inc: { total_voice: 1 } }
    );
  },

  async updateUser(username: any, userDiscriminator: any, userID: any) {
    return await User.updateOne(
      { user_id: userID },
      { user_name: username, user_discriminator: userDiscriminator }
    );
  },

  async updateTotalReactionsMinus(userID: any, guildID: any) {
    return await User.findOneAndUpdate(
      { user_id: userID, guild_id: guildID },
      { $inc: { total_reactions: -1 } }
    );
  },

  async updateTotalImage(userID: any, guildID: any) {
    return User.findOneAndUpdate(
      { user_id: userID, guild_id: guildID },
      { $inc: { total_pictures: 1 } }
    );
  },

  async updateGuildName(guildName: any, guildID: any) {
    return await User.updateMany(
      { guild_id: guildID },
      { guild_name: guildName }
    );
  },

  async deleteGuild(guildID: any) {
    return await User.deleteMany({ guild_id: guildID });
  },

  async selectTotalPoints(userID: any, guildID: any) {
    return (
      (await User.findOne({ user_id: userID, guild_id: guildID }))?.points ?? 0
    );
  },

  async updateLevelXPPointsCommandsandMessages(userID: any, guildID: any, {
    level,
    xp,
    points,
    total_commands,
    total_messages,
  }: any) {
    return await User.findOneAndUpdate(
      { user_id: userID, guild_id: guildID },
      { $inc: { xp: xp, points: points, total_commands: total_commands, total_messages: total_messages, level: level } }
    );
  }
};
