const mongoose = require('mongoose');
const {mongodb_url} = require('../../config.json');

// Connect to MongoDB
async function connect() {
    try {
        await mongoose.connect(mongodb_url, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true
        }, () => { 
            console.log('connected to database myDb ;)') 
        })
    } catch (error) {
        console.log(error);
    }
}
connect();

//Create a table for settings of the bot in guilds
const guildSchema = new mongoose.Schema({
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
        type: Boolean,
        default: false
    },
    modChannelID: {
        type: String,
    },
    disabledCommands: {
        type: Array,
        default: []
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
        default: []
    },
    farewellChannelID: {
        type: String,
    },
    farewellMessage: {
        type: Array,
        default: []
    },
    pointTracking: {
        type: Boolean,
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
        type: Boolean,
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
        type: Boolean,
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
        default: [
            {
                type: "message", 
                data: { text: "?member has won ?role this week! Points have been reset, better lick next time!" }
            }
        ]
    },
    crownSchedule: {
        type: String,
        default: "0 21 * * 5"
    }
});

//Make the table
const Guild = mongoose.model('Guild', guildSchema);

//Make functions to interact with the table
async function insertRow(guildID, guildName, system_channel_id, welcome_channel_id, farewell_channel_id, crown_channel_id, xp_channel_id, mod_log_id, admin_role_id, mod_role_id, mute_role_id, crown_role_id){
    //Check if the guild is already in the table
    let row = await selectRow(guildID);
    if(row){
        //If it is, update the row
        await updateRow(guildID, guildName, system_channel_id, welcome_channel_id, farewell_channel_id, crown_channel_id, xp_channel_id, mod_log_id, admin_role_id, mod_role_id, mute_role_id, crown_role_id);
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
}

async function selectRow(guildID){
    try {
        return await Guild.findOne({guildID: guildID});
    } catch (error) {
        console.log(error);
    }
}

async function updateRow(guildID, guildName, system_channel_id, welcome_channel_id, farewell_channel_id, crown_channel_id, xp_channel_id, mod_log_id, admin_role_id, mod_role_id, mute_role_id, crown_role_id){
    try {
        return await Guild.updateOne({guildID: guildID}, {
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
}

async function updatesqlitetomongo(guildID, guildName, prefix, system_channel_id, starboard_channel_id, admin_role_id, mod_role_id, muted_role_id, auto_role_id, auto_kick, auto_ban, random_color, mod_channel_id, disabled_commands, mod_log_id, member_log_id, nickname_log_id, role_log_id, message_edit_log_id, message_delete_log_id, verification_role_id, verification_channel_id, verification_message, verification_message_id, verification_level, welcome_channel_id, welcome_message, farewell_channel_id, farewell_message, point_tracking, message_points, command_points, voice_points, xp_tracking, message_xp, command_xp, voice_xp, xp_message_action, xp_channel_id, crown_role_id, crown_channel_id, crown_message, crown_schedule){
    try {
        return await Guild.updateOne({guildID: guildID}, {
            guildName: guildName,
            prefix: prefix,
            systemChannelID: system_channel_id,
            starboardChannelID: starboard_channel_id,
            adminRoleID: admin_role_id,
            modRoleID: mod_role_id,
            mutedRoleID: muted_role_id,
            autoRoleID: auto_role_id,
            autoKick: auto_kick,
            autoBan: auto_ban,
            randomColor: random_color,
            modChannelID: mod_channel_id,
            disabledCommands: disabled_commands,
            modLogID: mod_log_id,
            memberLogID: member_log_id,
            nicknameLogID: nickname_log_id,
            roleLogID: role_log_id,
            messageEditLogID: message_edit_log_id,
            messageDeleteLogID: message_delete_log_id,
            verificationRoleID: verification_role_id,
            verificationChannelID: verification_channel_id,
            verificationMessage: verification_message,
            verificationMessageID: verification_message_id,
            verificationLevel: verification_level,
            welcomeChannelID: welcome_channel_id,
            welcomeMessage: welcome_message,
            farewellChannelID: farewell_channel_id,
            farewellMessage: farewell_message,
            pointTracking: point_tracking,
            messagePoints: message_points,
            commandPoints: command_points,
            voicePoints: voice_points,
            xpTracking: xp_tracking,
            messageXP: message_xp,
            commandXP: command_xp,
            voiceXP: voice_xp,
            xpMessageAction: xp_message_action,
            xpChannelID: xp_channel_id,
            crownRoleID: crown_role_id,
            crownChannelID: crown_channel_id,
            crownMessage: crown_message,
            crownSchedule: crown_schedule
        });
    } catch (error) {
        console.log(error);
    }
}

async function selectGuilds(){
    try {
        //Select all rows from the table, only the guildID and guildName
        return await Guild.find({}, {guildID: 1, guildName: 1});
    } catch (error) {
        console.log(error);
    }
}

async function deleteGuild(guildID){
    try {
        return await Guild.deleteOne({guildID: guildID});
    } catch (error) {
        console.log(error);
    }
}

module.exports.settings = {
    Guild,
    insertRow,
    selectRow,
    updatesqlitetomongo,
    selectGuilds,
    deleteGuild
}