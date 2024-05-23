import { CommandTypes, CommandOptions } from '../../utils/utils';
import { PermissionsBitField } from 'discord.js';
import backup from 'discord-rebackup';

let command: CommandOptions = {
    name: "backup",
    type: CommandTypes.Owner,
    aliases: ["bkp"],
    botPermissions: [PermissionsBitField.Flags.Administrator],
    userPermissions: [PermissionsBitField.Flags.Administrator],
    cooldown: 30,
    usage: "backup <create | load | delete | info> <backupID>",
    async run(message, args, client) {

        const [action, backupID] = args;

        if (!action) return message.reply("You need to provide an action.");

        switch (action.toLowerCase()) {
            case "create":
                await backup.create(message.guild!, {
                    maxMessagesPerChannel: 100,
                    jsonBeautify: true,
                    backupMembers: true,
                    saveImages: "base64"
                }).then((backupData) => {
                    message.reply(`Backup created with ID: ${backupData.id}`);
                }).catch((err) => {
                    console.log(err);
                    message.reply(`Error: ${err}`);
                });

                break;
            case "load":
                if (!backupID) return message.reply("You need to provide a backup ID.");

                await backup.load(backupID, message.guild!, {
                    clearGuildBeforeRestore: true,
                    maxMessagesPerChannel: 100,
                    allowedMentions: {
                        parse: []
                    }
                }).then(() => {
                    message.reply("Backup loaded.");
                }).catch((err) => {
                    message.reply(`Error: ${err}`);
                });

                break;
            case "delete":
                if (!backupID) return message.reply("You need to provide a backup ID.");

                await backup.remove(backupID).then(() => {
                    message.reply("Backup deleted.");
                }).catch((err) => {
                    message.reply(`Error: ${err}`);
                });

                break;
            case "info":
                if (!backupID) return message.reply("You need to provide a backup ID.");

                await backup.fetch(backupID).then((backupData) => {
                    message.reply(`**Backup info**\nID: ${backupData.id}\nSize: ${backupData.size} bytes\nCreated at: <t:${Math.round(backupData.data.createdTimestamp / 1000)}:R>`);
                }).catch((err) => {
                    message.reply(`Error: ${err}`);
                });

                break;
            default:
                message.reply("Invalid action.");
                break;
        }
    }
}

export = command;
