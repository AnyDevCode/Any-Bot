const mongoose = require("mongoose");

const Warn = mongoose.model(
  "Warns",
  new mongoose.Schema(
    {
      userID: {
        type: String,
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
      userDiscriminator: {
        type: String,
        required: true,
      },
      guildID: {
        type: String,
        required: true,
      },
      guildName: {
        type: String,
        required: true,
      },
      dateIssued: {
        type: Date,
        required: true,
      },
      reason: {
        type: String,
        required: false,
        default: "No reason given",
      },
      moderatorID: {
        type: String,
        required: true,
      },
      moderatorName: {
        type: String,
        required: true,
      },
      moderatorDiscriminator: {
        type: String,
        required: true,
      },
      warnID: {
        type: Number,
        unique: true,
        index: true,
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

  async updatesqlitetomongo(ArrayOfWarns) {
    const oldWarns = await this.selectAllWarns();
    const newWarns = ArrayOfWarns;

    for (let i = 0; i < newWarns.length; i++) {
      let newWarn = newWarns[i];
      let oldWarn = oldWarns.find((warn) => warn.warnID === newWarn.warnID);
      if (oldWarn) {
        newWarn.warn_id = Number(newWarn.warn_id);
        oldWarn.warnID = Number(oldWarn.warnID);
        newWarn.date_issued = new Date(newWarn.date_issued);
        const update = {
          userID: newWarn.user_id,
          userName: newWarn.user_name,
          userDiscriminator: newWarn.user_discriminator,
          guildID: newWarn.guild_id,
          guildName: newWarn.guild_name,
          dateIssued: newWarn.date_issued,
          reason: newWarn.reason,
          moderatorID: newWarn.moderator_id,
          moderatorName: newWarn.moderator_name,
          moderatorDiscriminator: newWarn.moderator_discriminator,
          warnID: newWarn.warn_id,
        };
        await this.updateRow(
          update.userID,
          update.userName,
          update.userDiscriminator,
          update.guildID,
          update.guildName,
          update.moderatorID,
          update.moderatorName,
          update.moderatorDiscriminator,
          update.reason,
          update.dateIssued,
          update.warnID
        );
      } else {
        await this.insertRow(
          newWarn.user_id,
          newWarn.user_name,
          newWarn.user_discriminator,
          newWarn.guild_id,
          newWarn.guild_name,
          newWarn.moderator_id,
          newWarn.moderator_name,
          newWarn.moderator_discriminator,
          newWarn.reason,
          newWarn.date_issued,
          newWarn.warn_id
        );
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
