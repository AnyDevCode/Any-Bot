const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const Discord = require("discord.js");
const backup = require("discord-backup");
  backup.setStorageFolder(__dirname+"/backups/");

module.exports = class BackupCreateCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'backupcreate',
      usage: 'backupcreate',
      aliases: ['bucreate'],
      description: 'Create a backup',
      type: client.types.BACKUP
    });
  }
  async run(message) {
	  
    let perms = message.member.hasPermission("ADMINISTRATOR");

    if (!perms)
      return message.channel.send(
       "鉂� `|` **Sorry "+`${message.author}`+", You don't have ʻAdministrator` permissions to execute that command**"
      );
    backup
      .create(message.guild, {
        jsonBeautify: true
      })
      .then(backupData => {
        // And send informations to the backup owner
        message.author.send(
          new Discord.MessageEmbed()
         .setAuthor(`鉁� Backup created successfully 鉁卄`)
          .setColor(message.guild.me.displayHexColor)
          .setDescription(`To load backup, use >backupload ${backupData.id}`)
          .setThumbnail(message.author.displayAvatarURL())
          )
        message.channel.send(//backupData.id
          new Discord.MessageEmbed()
          .setAuthor(`鉁� Backup created successfully 鉁卄`)
          .setColor(message.guild.me.displayHexColor)
          .setThumbnail(message.author.displayAvatarURL())
          .setDescription("**The backup ID has been sent to the MD**")
        );
      });
    }
  };
