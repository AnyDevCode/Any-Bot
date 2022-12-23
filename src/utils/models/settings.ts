import mongoose from 'mongoose';

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
        default: process.env.PREFIX || '>'
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

    language: {
        type: String,
        default: "en"
    }
}));

export = {
    async insertRow(guildID: any, guildName: any, system_channel_id: any, welcome_channel_id: any, farewell_channel_id: any, crown_channel_id: any, xp_channel_id: any, mod_log_id: any, admin_role_id: any, mod_role_id: any, mute_role_id: any, crown_role_id: any) {
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
                console.log(error);
            }
        }
    },

    async selectRow(guildID: any) {
        try {
            return await Guild.findOne({
                guildID: guildID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateRow(guildID: any, guildName: any, system_channel_id: any, welcome_channel_id: any, farewell_channel_id: any, crown_channel_id: any, xp_channel_id: any, mod_log_id: any, admin_role_id: any, mod_role_id: any, mute_role_id: any, crown_role_id: any) {
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
            console.log(error);
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
            console.log(error);
        }
    },

    async deleteGuild(guildID: any) {
        try {
            return await Guild.deleteOne({
                guildID: guildID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateGuildName(guildName: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                guildName: guildName
            });
        } catch (error) {
            console.log(error);
        }
    },

    async selectDisabledCommands(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                disabledCommands: 1
            }))?.disabledCommands;
        } catch (error) {
            console.log(error);
        }
    },

    async selectPoints(guildID: any) {
        try {
            return await Guild.findOne({
                guildID: guildID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async selectXP(guildID: any) {
        try {
            return await Guild.findOne({
                guildID: guildID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async selectPrefix(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                prefix: 1
            }))?.prefix;
        } catch (error) {
            console.log(error);
        }
    },

    async selectModChannelIds(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                modChannelIDs: 1
            }))?.modChannelIDs;
        } catch (error) {
            console.log(error);
        }
    },


    async selectVerificationChannelId(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                verificationChannelID: 1
            }))?.verificationChannelID;
        } catch (error) {
            console.log(error);
        }
    },

    async selectStarboardChannelId(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                starboardChannelID: 1
            }))?.starboardChannelID;
        } catch (error) {
            console.log(error);
        }
    },

    async updateModChannelIds(modChannelIDs: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                modChannelIDs: modChannelIDs
            })
        } catch (error) {
            console.log(error);
        }
    },

    async selectAutoBan(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                autoBan: 1
            }))?.autoBan;
        } catch (error) {
            console.log(error);
        }
    },

    async updateAutoBan(autoBan: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                autoBan: autoBan
            });
        } catch (error) {
            console.log(error);
        }
    },

    async selectAdminRoleId(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                adminRoleID: 1
            }))?.adminRoleID;
        } catch (error) {
            console.log(error);
        }
    },

    async updateAdminRoleId(adminRoleID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                adminRoleID: adminRoleID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async selectAutoKick(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                autoKick: 1
            }))?.autoKick;
        } catch (error) {
            console.log(error);
        }
    },

    async updateAutoKick(autoKick: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                autoKick: autoKick
            });
        } catch (error) {
            console.log(error);
        }
    },

    async selectAutoRoleId(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                autoRoleID: 1
            }))?.autoRoleID;
        } catch (error) {
            console.log(error);
        }
    },

    async updateAutoRoleId(autoRoleID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                autoRoleID: autoRoleID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateCommandXP(commandXP: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                commandXP: commandXP
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateCommandPoints(commandPoints: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                commandPoints: commandPoints
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateCrownChannelId(crownChannelID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                crownChannelID: crownChannelID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateCrownMessage(crownMessage: any, guildID: any) {

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
            console.log(error);
        }
    },

    async updateCrownRoleId(crownRoleID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                crownRoleID: crownRoleID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateCrownSchedule(crownSchedule: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                crownSchedule: crownSchedule
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateFarewellChannelId(farewellChannelID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                farewellChannelID: farewellChannelID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateFarewellMessage(farewellMessage: any, guildID: any) {

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
            console.log(error);
        }
    },
    async selectMemberLogId(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                memberLogID: 1
            }))?.memberLogID;
        } catch (error) {
            console.log(error);
        }
    },

    async updateMemberLogId(memberLogID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                memberLogID: memberLogID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async selectMessageDeleteLogId(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                messageDeleteLogID: 1
            }))?.messageDeleteLogID;
        } catch (error) {
            console.log(error);
        }
    },
    async updateMessageDeleteLogId(messageDeleteLogID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                messageDeleteLogID: messageDeleteLogID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async selectMessageEditLogId(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                messageEditLogID: 1
            }))?.messageEditLogID;
        } catch (error) {
            console.log(error);
        }
    },

    async updateMessageEditLogId(messageEditLogID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                messageEditLogID: messageEditLogID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateMessagePoints(messagePoints: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                messagePoints: messagePoints
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateMessageXP(messageXP: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                messageXP: messageXP
            });
        } catch (error) {
            console.log(error);
        }
    },

    async selectModLogId(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                modLogID: 1
            }))?.modLogID;
        } catch (error) {
            console.log(error);
        }
    },

    async updateModLogId(modLogID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                modLogID: modLogID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async selectModRoleId(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                modRoleID: 1
            }))?.modRoleID;
        } catch (error) {
            console.log(error);
        }
    },

    async updateModRoleId(modRoleID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                modRoleID: modRoleID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async selectMuteRoleId(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                mutedRoleID: 1
            }))?.mutedRoleID;
        } catch (error) {
            console.log(error);
        }
    },

    async updateMuteRoleId(mutedRoleID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                mutedRoleID: mutedRoleID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async selectNicknameLogId(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                nicknameLogID: 1
            }))?.nicknameLogID;
        } catch (error) {
            console.log(error);
        }
    },

    async updateNicknameLogId(nicknameLogID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                nicknameLogID: nicknameLogID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updatePrefix(prefix: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                prefix: prefix
            });
        } catch (error) {
            console.log(error);
        }
    },

    async selectRoleLogId(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                roleLogID: 1
            }))?.roleLogID;
        } catch (error) {
            console.log(error);
        }
    },

    async updateRoleLogId(roleLogID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                roleLogID: roleLogID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateStarboardChannelId(starboardChannelID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                starboardChannelID: starboardChannelID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async selectSystemChannelId(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                systemChannelID: 1
            }))?.systemChannelID;
        } catch (error) {
            console.log(error);
        }
    },

    async updateSystemChannelId(systemChannelID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                systemChannelID: systemChannelID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateVerificationMessage(verificationMessage: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                verificationMessage: verificationMessage
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateVerificationMessageId(verificationMessageID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                verificationMessageID: verificationMessageID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateVerificationChannelId(verificationChannelID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                verificationChannelID: verificationChannelID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateVerificationRoleId(verificationRoleID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                verificationRoleID: verificationRoleID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateVoicePoints(voicePoints: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                voicePoints: voicePoints
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateVoiceXP(voiceXP: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                voiceXP: voiceXP
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateWelcomeChannelId(welcomeChannelID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                welcomeChannelID: welcomeChannelID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateWelcomeMessage(welcomeMessage: any, guildID: any) {
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
            console.log(error);
        }
    },

    async selectRandomColor(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }, {
                randomColor: 1
            }))?.randomColor;
        } catch (error) {
            console.log(error);
        }
    },

    async updateXPChannelId(xpChannelID: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                xpChannelID: xpChannelID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateDisabledCommands(disabledCommands: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                disabledCommands: disabledCommands
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updatePointTracking(pointTracking: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                pointTracking: pointTracking
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateRandomColor(randomColor: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                randomColor: randomColor
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateXPTracking(xpTracking: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                xpTracking: xpTracking
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateXPChannelMessage(xpChannelMessage: any, guildID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                xpMessageAction: xpChannelMessage
            });
        } catch (error) {
            console.log(error);
        }
    },

    async antiPhishing(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }))?.antiPhishing;
        } catch (error) {
            console.log(error);
        }
    },

    async updateAntiPhishing(guildID: any, boolean: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                antiPhishing: boolean
            });
        } catch (error) {
            console.log(error);
        }
    },

    async antiPhishingSystem(guildID: any) {
        try {
            return await Guild.findOne({
                guildID: guildID
            }, {
                antiPhishingSystem: 1
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateAntiPhishingSystem(guildID: any, number: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                antiPhishingSystem: number
            });
        } catch (error) {
            console.log(error);
        }
    },

    async antiPhishingLogsChannelID(guildID: any) {
        try {
            return await Guild.findOne({
                guildID: guildID
            }, {
                antiPhishingLogsChannelID: 1
            });
        } catch (error) {
            console.log(error);
        }
    },

    async updateAntiPhishingLogsChannelID(guildID: any, channelID: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                antiPhishingLogsChannelID: channelID
            });
        } catch (error) {
            console.log(error);
        }
    },

    async getLanguage(guildID: any) {
        try {
            return (await Guild.findOne({
                guildID: guildID
            }))?.language || "en";
        } catch (error) {
            console.log(error);
        }
    },

    async setLanguage(guildID: any, language: any) {
        try {
            return await Guild.updateOne({
                guildID: guildID
            }, {
                language: language
            });
        } catch (error) {
            console.log(error);
        }
    }
}