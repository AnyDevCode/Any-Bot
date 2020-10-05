const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const Discord = require("discord.js");
const backup = require("discord-backup");
  backup.setStorageFolder(__dirname+"/backups/");
module.exports = class BackupLoadCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'backupload',
      usage: 'backupload',
      aliases: ['buload'],
      description: 'Load any existing backup',
      type: client.types.BACKUP
    });
  }
  async run(message, args) {
	  
        // Check member permissions
        if(!message.member.hasPermission("ADMINISTRATOR")){
            return message.channel.send(":x: | You must be an administrator of this server to load a backup!");
        }
        let backupID = args[0];
        if(!backupID){
            return message.channel.send(":x: | You must specify a valid backup ID!");
        }
        // Fetching the backup to know if it exists
        backup.fetch(backupID).then(async () => {
            // If the backup exists, request for confirmation
            message.channel.send(":warning: | When the backup is loaded, all the channels, roles, etc. will be replaced! React with ✅ to confirm!").then(m => {
				m.react("✅")
			const filtro = (reaction, user) => {
            return ["✅"].includes(reaction.emoji.name) && user.id == message.author.id;
            };
                m.awaitReactions(filtro, {
                    max: 1,
                    time: 20000,
                    errors: ["time"]
                }).catch(() => {
                    // if the author of the commands does not confirm the backup loading
                    m.edit(":x: | Time's up! Cancelled backup loading!");
                }).then(coleccionado=> {
					
				const reaccion = coleccionado.first();
				if(reaccion.emoji.name === "✅"){
                  // When the author of the command has confirmed that he wants to load the backup on his server
                  message.author.send(":white_check_mark: | Start loading the backup!");
                  // Load the backup
                  backup.load(backupID, message.guild).then(() => {
                    // When the backup is loaded, delete them from the server
                      backup.remove(backupID);
                  }).catch((err) => {
                      // If an error occurred
                      return message.author.send(":x: | Sorry, an error occurred... Please check that I have administrator permissions!");
                  });
        };
		
				})
			})
    });
}};
