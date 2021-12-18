const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const Discord = require("discord.js");
const backup = require("discord-backup");
backup.setStorageFolder(__dirname + "/backups/");

module.exports = class BackupCreateCommand extends Command {
  constructor(client) {
    super(client, {
      name: "backup",
      usage: "backup",
      aliases: ["bu"],
      description: "Create and charge a backup of the server",
      usage: "backup [create/info/load] <ID>",
      examples: ["backup create", "backup info 123456", "backup load 123456"],
      type: client.types.BACKUP,
    });
  }
  async run(message, args, client) {
    if (message.guild.ownerID !== message.author.id)
      return this.sendErrorMessage(
        message,
        3,
        "You must be the server owner to use this command!"
      );

    const options = args[0];
    const backupID = args[1];

    switch (options) {
      case "create":
        backup
          .create(message.guild, {
            jsonBeautify: true,
          })
          .then((backupData) => {
            // And send informations to the backup owner
            message.author.send(
              new Discord.MessageEmbed()
                .setAuthor(`Backup created successfully!`)
                .setColor(message.guild.me.displayHexColor)
                .setDescription(
                  `To load backup, use ${message.client.db.settings.selectPrefix.get(
                    message.guild.id
                  )}backup load ${backupData.id}`
                )
                .setThumbnail(message.author.displayAvatarURL())
            );
            message.channel.send(
              //backupData.id
              new Discord.MessageEmbed()
                .setAuthor(`Backup created successfully!`)
                .setColor(message.guild.me.displayHexColor)
                .setThumbnail(message.author.displayAvatarURL())
                .setDescription("**The backup ID has been sent to the MD**")
            );
          });
        break;
      case "info":
        if (!backupID)
          return this.sendErrorMessage(
            message,
            0,
            "Please specify a backup ID!"
          );
        // Fetch the backup
        backup
          .fetch(backupID)
          .then((backupInfos) => {
            const date = new Date(backupInfos.data.createdTimestamp);
            const yyyy = date.getFullYear().toString(),
              mm = (date.getMonth() + 1).toString(),
              dd = date.getDate().toString();
            const formatedDate = `${yyyy}/${mm[1] ? mm : "0" + mm[0]}/${
              dd[1] ? dd : "0" + dd[0]
            }`;
            let embed = new Discord.MessageEmbed()
              .setAuthor("Backup Informations")
              // Display the backup ID
              .addField("Backup ID", backupInfos.id, false)
              // Displays the server from which this backup comes
              .addField("Server ID", backupInfos.data.guildID, false)
              // Display the size (in mb) of the backup
              .addField("Size", `${backupInfos.size} mb`, false)
              // Display when the backup was created
              .addField("Created at", formatedDate, false)
              .setColor("#FF0000");
            message.channel.send(embed);
          })
          .catch((err) => {
            // if the backup wasn't found
            return this.sendErrorMessage(message, 1, "Backup not found!");
          });
        break;
      case "load":
        if (!backupID)
          return this.sendErrorMessage(
            message,
            0,
            "Please specify a backup ID!"
          );
        backup.fetch(backupID).then(async () => {
          // If the backup exists, request for confirmation
          message.channel
            .send(
              ":warning: | When the backup is loaded, all the channels, roles, etc. will be replaced! React with ✅ to confirm!"
            )
            .then((m) => {
              m.react("✅");
              const filtro = (reaction, user) => {
                return (
                  ["✅"].includes(reaction.emoji.name) &&
                  user.id == message.author.id
                );
              };
              m.awaitReactions(filtro, {
                max: 1,
                time: 20000,
                errors: ["time"],
              })
                .catch(() => {
                  // if the author of the commands does not confirm the backup loading
                  m.edit(":x: | Time's up! Cancelled backup loading!");
                })
                .then((coleccionado) => {
                  const reaccion = coleccionado.first();
                  if (reaccion.emoji.name === "✅") {
                    // When the author of the command has confirmed that he wants to load the backup on his server
                    message.author.send(
                      ":white_check_mark: | Start loading the backup!"
                    );
                    // Load the backup
                    backup
                      .load(backupID, message.guild)
                      .then(() => {
                        // When the backup is loaded, delete them from the server
                        backup.remove(backupID);
                      })
                      .catch((err) => {
                        // If an error occurred
                        return this.sendErrorMessage(
                          message,
                          3,
                          "An error occurred, check if I have administrator permissions"
                        );
                      });
                  }
                });
            });
        });
        break;
      default:
        return this.sendErrorMessage(
          command,
          0,
          `Invalid option! For more info, use ${message.client.db.settings.selectPrefix.get(
            message.guild.id
          )}help backup`
        );
    }
  }
};
