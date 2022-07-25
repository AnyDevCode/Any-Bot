const mongoose = require('mongoose');

const Guild = mongoose.model('Settings', new mongoose.Schema({
    guildID: {
        type: String,
        required: true,
        unique: true
    },
    guildName: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        required: true,
        maxlength: 4,
        default: ">"
    },
    systemChannelID: {
        type: String,
    },
    starboardChannelID: {
        type: String,
    },
    adminRoleID: {
        type: String,
    },
    modRoleID: {
        type: String,
    },
    mutedRoleID: {
        type: String,
    },
    autoRoleID: {
        type: String,
    },
    autoKick: {
        type: Number,
    },
    autoBan: {
        type: Number,
    },
    randomColor: {
        type: Number,
        default: false
    },
    modChannelIDs: {
        type: String,
        default: ""
    },
    disabledCommands: {
        type: String,
        default: null
    },
    modLogID: {
        type: String,
    },
    memberLogID: {
        type: String,
    },
    nicknameLogID: {
        type: String,
    },
    roleLogID: {
        type: String,
    },
    messageEditLogID: {
        type: String,
    },
    messageDeleteLogID: {
        type: String,
    },
    verificationRoleID: {
        type: String,
    },
    verificationChannelID: {
        type: String,
    },
    verificationMessage: {
        type: String,
    },
    verificationMessageID: {
        type: String,
    },
    verificationLevel: {
        type: Number,
        default: 0
    },
    welcomeChannelID: {
        type: String,
    },
    welcomeMessage: {
        type: Array,
        default: [{
            type: "message",
            data: {
                text: "Welcome ?member to ?guild !"
            }
        }]
    },
    farewellChannelID: {
        type: String,
    },
    farewellMessage: {
        type: Array,
        default: [{
            type: "message",
            data: {
                text: "Goodbye ?member !"
            }
        }]
    },
    pointTracking: {
        type: Number,
        default: false,
        required: true
    },
    messagePoints: {
        type: Number,
        default: 1,
        required: true
    },
    commandPoints: {
        type: Number,
        default: 1,
        required: true
    },
    voicePoints: {
        type: Number,
        default: 1,
        required: true
    },
    xpTracking: {
        type: Number,
        default: false,
        required: true
    },
    messageXP: {
        type: Number,
        default: 1,
        required: true
    },
    commandXP: {
        type: Number,
        default: 1,
        required: true
    },
    voiceXP: {
        type: Number,
        default: 1,
        required: true
    },
    xpMessageAction: {
        type: Number,
        default: false,
        required: true
    },
    xpChannelID: {
        type: String,
    },
    crownRoleID: {
        type: String,
    },
    crownChannelID: {
        type: String,
    },
    crownMessage: {
        type: Array,
        default: [{
            type: "message",
            data: {
                text: "?member has won ?role this week! Points have been reset, better lick next time!"
            }
        }]
    },
    crownSchedule: {
        type: String,
        default: "0 21 * * 5"
    },
    antiPhishing: {
        type: Boolean,
        default: false
    },
    antiPhishingSystem: {
        type: Number,
        default: 1
    },
    antiPhishingLogsChannelID: {
        type: String,
    },
}));

module.exports = {
    async insertRow(guildID, guildName, system_channel_id, welcome_channel_id, farewell_channel_id, crown_channel_id, xp_channel_id, mod_log_id, admin_role_id, mod_role_id, mute_role_id, crown_role_id) {
        //Check if the guild is already in the table

        let row = await this.selectRow(guildID);
        if (row) {
            //If it is, update the row
            await this.updateRow(guildID, guildName, system_channel_id, welcome_channel_id, farewell_channel_id, crown_channel_id, xp_channel_id, mod_log_id, admin_role_id, mod_role_id, mute_role_id, crown_role_id);
        } else {
            try {
                const newGuild = new Guild({
                    guildID: guildID,
                    guildName: guildName,
                    systemChannelID: system_channel_id,
                    welcomeChannelID: welcome_channel_id,
                    farewellChannelID: farewell_channel_id,
                    crownChannelID: crown_channel_id,
                    xpChannelID: xp_channel_id,
                    modLogID: mod_log_id,
                    adminRoleID: admin_role_id,
                    modRoleID: mod_role_id,
                    mutedRoleID: mute_role_id,
                    crownRoleID: crown_role_id
                });
                return newGuild.save();
            } catch (error) {
                __Client.logger.error(error);
            }
        }
    },

    async selectRow(guildID) {
        try {
            return await Guild.findOne({
                guildID: guildID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateRow(guildID, guildName, system_channel_id, welcome_channel_id, farewell_channel_id, crown_channel_id, xp_channel_id, mod_log_id, admin_role_id, mod_role_id, mute_role_id, crown_role_id) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                guildName: guildName,
                systemChannelID: system_channel_id,
                welcomeChannelID: welcome_channel_id,
                farewellChannelID: farewell_channel_id,
                crownChannelID: crown_channel_id,
                xpChannelID: xp_channel_id,
                modLogID: mod_log_id,
                adminRoleID: admin_role_id,
                modRoleID: mod_role_id,
                mutedRoleID: mute_role_id,
                crownRoleID: crown_role_id
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectGuilds() {
        try {
            //Select all rows from the table, only the guildID and guildName
            return await Guild.find({}, {
                guildID: 1,
                guildName: 1
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async deleteGuild(guildID) {
        try {
            return await Guild.deleteOne({
                guildID: guildID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateGuildName(guildName, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                guildName: guildName
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectDisabledCommands(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                disabledCommands: 1
            })).disabledCommands;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectPoints(guildID) {
        try {
            return await Guild.findOne({
                guildID: guildID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectXP(guildID) {
        try {
            return await Guild.findOne({
                guildID: guildID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectPrefix(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                prefix: 1
            })).prefix;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectModChannelIds(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                modChannelIDs: 1
            })).modChannelIDs;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectMessageDeleteLogId(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                messageDeleteLogID: 1
            })).messageDeleteLogID;
        } catch (error) {
            __Client.logger.error(error);
        }
    },


    async selectVerificationChannelId(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                verificationChannelID: 1
            })).verificationChannelID;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectStarboardChannelId(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                starboardChannelID: 1
            })).starboardChannelID;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateModChannelIds(modChannelIDs, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                modChannelIDs: modChannelIDs
            })
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectAutoBan(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                autoBan: 1
            })).autoBan;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateAutoBan(autoBan, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                autoBan: autoBan
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectAdminRoleId(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                adminRoleID: 1
            })).adminRoleID;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateAdminRoleId(adminRoleID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                adminRoleID: adminRoleID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectAutoKick(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                autoKick: 1
            })).autoKick;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateAutoKick(autoKick, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                autoKick: autoKick
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectAutoRoleId(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                autoRoleID: 1
            })).autoRoleID;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateAutoRoleId(autoRoleID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                autoRoleID: autoRoleID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateCommandXP(commandXP, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                commandXP: commandXP
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateCommandPoints(commandPoints, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                commandPoints: commandPoints
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateCrownChannelId(crownChannelID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                crownChannelID: crownChannelID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateCrownMessage(crownMessage, guildID) {

        let message = [];
        message[0] = {
            type: "message",
            data: {
                text: crownMessage
            }
        }

        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                crownMessage: message
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateCrownRoleId(crownRoleID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                crownRoleID: crownRoleID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateCrownSchedule(crownSchedule, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                crownSchedule: crownSchedule
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateFarewellChannelId(farewellChannelID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                farewellChannelID: farewellChannelID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateFarewellMessage(farewellMessage, guildID) {

        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                farewellMessage: [{
                    type: "message",
                    data: {
                        text: farewellMessage
                    }
                }]
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },
    async selectMemberLogId(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                memberLogID: 1
            })).memberLogID;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateMemberLogId(memberLogID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                memberLogID: memberLogID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectMessageDeleteLogId(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                messageDeleteLogID: 1
            })).messageDeleteLogID;
        } catch (error) {
            __Client.logger.error(error);
        }
    },
    async updateMessageDeleteLogId(messageDeleteLogID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                messageDeleteLogID: messageDeleteLogID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectMessageEditLogId(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                messageEditLogID: 1
            })).messageEditLogID;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateMessageEditLogId(messageEditLogID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                messageEditLogID: messageEditLogID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateMessagePoints(messagePoints, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                messagePoints: messagePoints
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateMessageXP(messageXP, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                messageXP: messageXP
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectModLogId(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                modLogID: 1
            })).modLogID;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateModLogId(modLogID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                modLogID: modLogID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectModRoleId(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                modRoleID: 1
            })).modRoleID;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateModRoleId(modRoleID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                modRoleID: modRoleID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectMuteRoleId(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                mutedRoleID: 1
            })).mutedRoleID;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateMuteRoleId(mutedRoleID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                mutedRoleID: mutedRoleID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectNicknameLogId(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                nicknameLogID: 1
            })).nicknameLogID;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateNicknameLogId(nicknameLogID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                nicknameLogID: nicknameLogID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updatePrefix(prefix, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                prefix: prefix
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectRoleLogId(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                roleLogID: 1
            })).roleLogID;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateRoleLogId(roleLogID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                roleLogID: roleLogID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateStarboardChannelId(starboardChannelID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                starboardChannelID: starboardChannelID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectSystemChannelId(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                systemChannelID: 1
            })).systemChannelID;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateSystemChannelId(systemChannelID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                systemChannelID: systemChannelID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateVerificationMessage(verificationMessage, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                verificationMessage: verificationMessage
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateVerificationMessageId(verificationMessageID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                verificationMessageID: verificationMessageID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateVerificationChannelId(verificationChannelID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                verificationChannelID: verificationChannelID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateVerificationRoleId(verificationRoleID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                verificationRoleID: verificationRoleID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateVoicePoints(voicePoints, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                voicePoints: voicePoints
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateVoiceXP(voiceXP, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                voiceXP: voiceXP
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateWelcomeChannelId(welcomeChannelID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                welcomeChannelID: welcomeChannelID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateWelcomeMessage(welcomeMessage, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                welcomeMessage: [{
                    type: "message",
                    data: {
                        text: welcomeMessage
                    }
                }]
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async selectRandomColor(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                randomColor: 1
            })).randomColor;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateXPChannelId(xpChannelID, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                xpChannelID: xpChannelID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateDisabledCommands(disabledCommands, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                disabledCommands: disabledCommands
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updatePointTracking(pointTracking, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                pointTracking: pointTracking
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateRandomColor(randomColor, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                randomColor: randomColor
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateXPTracking(xpTracking, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                xpTracking: xpTracking
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateXPChannelMessage(xpChannelMessage, guildID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                xpMessageAction: xpChannelMessage
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async antiPhishing(guildID) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            })).antiPhishing;
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateAntiPhishing(guildID, boolean) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                antiPhishing: boolean
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async antiPhishingSystem(guildID) {
        try {
            return await Guild.findOne({
                guildID: guildID
            }, {
                antiPhishingSystem: 1
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateAntiPhishingSystem(guildID, number) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                antiPhishingSystem: number
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async antiPhishingLogsChannelID(guildID) {
        try {
            return await Guild.findOne({
                guildID: guildID
            }, {
                antiPhishingLogsChannelID: 1
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    },

    async updateAntiPhishingLogsChannelID(guildID, channelID) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                antiPhishingLogsChannelID: channelID
            });
        } catch (error) {
            __Client.logger.error(error);
        }
    }
}