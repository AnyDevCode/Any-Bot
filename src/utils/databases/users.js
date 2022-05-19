const mongoose = require("mongoose");
const { users } = require("node-os-utils");

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
    return await User.findOne({ user_id: userID, guild_id: guildID });
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
      } catch (error) {
        //console.log(error);
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

  updateCurrentMember(current_member, userID, guildId ) {
    return User.updateOne({ user_id: userID, guild_id: guildId }, { current_member: current_member });
  },
  async selectCurrentMembers(guildID) {
    return User.find({ guild_id: guildID, current_member: true });
  }
};
