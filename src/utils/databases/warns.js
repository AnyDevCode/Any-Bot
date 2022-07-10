const mongoose = require("mongoose");

const Warn = mongoose.model(
  "Warns",
  new mongoose.Schema(
    {
      userID: {
        type: String,
      },
      userName: {
        type: String,
      },
      userDiscriminator: {
        type: String,
      },
      guildID: {
        type: String,
      },
      guildName: {
        type: String,
      },
      dateIssued: {
        type: Date,
      },
      reason: {
        type: String,
        default: "No reason given",
      },
      moderatorID: {
        type: String,
      },
      moderatorName: {
        type: String,
      },
      moderatorDiscriminator: {
        type: String,
      },
      warnID: {
        type: Number,
        unique: true,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = {
  async insertRow(
    user_id,
    user_name,
    user_discriminator,
    guild_id,
    guild_name,
    moderator_id,
    moderator_name,
    moderator_discriminator,
    reason,
    date_issued,
    warn_id
  ) {
    const warn = new Warn({
      userID: user_id,
      userName: user_name,
      userDiscriminator: user_discriminator,
      guildID: guild_id,
      guildName: guild_name,
      dateIssued: date_issued,
      reason: reason,
      moderatorID: moderator_id,
      moderatorName: moderator_name,
      moderatorDiscriminator: moderator_discriminator,
      warnID: warn_id,
    });
    return await warn.save();
  },

  async selectAllWarns() {
    const warns = await Warn.find({}).sort({ warnID: -1 });
    return warns;
  },

  async updateRow(
    userID,
    userName,
    userDiscriminator,
    guildID,
    guildName,
    moderatorID,
    moderatorName,
    moderatorDiscriminator,
    reason,
    dateIssued,
    warnID
  ) {
    const warn = await Warn.findOneAndUpdate(
      { warnID: warnID },
      {
        userID: userID,
        userName: userName,
        userDiscriminator: userDiscriminator,
        guildID: guildID,
        guildName: guildName,
        moderatorID: moderatorID,
        moderatorName: moderatorName,
        moderatorDiscriminator: moderatorDiscriminator,
        reason: reason,
        dateIssued: dateIssued,
        warnID: warnID,
      },
      { new: true }
    );
    return warn;
  },

  async updatesqlitetomongo(WarnsArray) {
    const newWarns = WarnsArray;

    for await (const warn of newWarns) {
      try {
          await this.insertRow(
            warn.user_id,
            warn.user_name,
            warn.user_discriminator,
            warn.guild_id,
            warn.guild_name,
            warn.moderator_id,
            warn.moderator_name,
            warn.moderator_discriminator,
            warn.reason,
            warn.date_issued,
            warn.warn_id
          );
      } catch (e) {
        __Client.logger.error(e);
      }
    }
  },

  async maxWarnId() {
    const maxWarnId = await Warn.find({}).sort({ warnID: -1 }).limit(1);
    return maxWarnId[0].warnID;
  },

  async selectRow(warn_id) {
    const warn = await Warn.find({ warnID: warn_id });
    return warn;
  },

  async selectUserWarns(user_id, guild_id) {
    const warns = await Warn.find({
      userID: user_id,
      guildID: guild_id,
    });
    return warns;
  },

  async selectGuildWarns(guild_id) {
    const warns = await Warn.find({ guildID: guild_id });
    return warns;
  },

  async updateGuildName(guild_id, guild_name) {
    const warn = await Warn.findOneAndUpdate(
      { guildID: guild_id },
      { guildName: guild_name },
      { new: true }
    );
    return warn;
  },

  async warnsByUser(user_id, guild_id) {
    const warns = await Warn.find({
      userID: user_id,
      guildID: guild_id,
    });
    return warns;
  },

  async deleteUserWarns(user_id, guild_id) {
    const warns = await Warn.deleteMany({
      userID: user_id,
      guildID: guild_id,
    });
    return warns;
  },

  async selectUserWarnsCount(user_id, guild_id) {
    const warns = await Warn.find({
      userID: user_id,
      guildID: guild_id,
    });
    return warns.length;
  },

  async createWarn(
    user_id,
    user_name,
    user_discriminator,
    guild_id,
    guild_name,
    moderator_id,
    moderator_name,
    moderator_discriminator,
    reason,
    date_issued,
    warn_id
  ) {
    const time = new Date(date_issued);
    const warn = new Warn({
      userID: user_id,
      userName: user_name,
      userDiscriminator: user_discriminator,
      guildID: guild_id,
      guildName: guild_name,
      dateIssued: time,
      reason: reason,
      moderatorID: moderator_id,
      moderatorName: moderator_name,
      moderatorDiscriminator: moderator_discriminator,
      warnID: warn_id,
    });
    return await warn.save();
  },

  async getWarnById(warn_id) {
    const warn = await Warn.find({ warnID: warn_id });
    return warn[0];
  },

  async deleteWarn(warn_id) {
    const warn = await Warn.deleteMany({ warnID: warn_id });
    return warn;
  },
};
