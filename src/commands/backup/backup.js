// Dependencies:
const backup = require("discord-backup");
const { MessageEmbed } = require("discord.js");
// Command Require:
const Command = require("../Command.js");
// Set Backup Folder:
backup.setStorageFolder(__basedir + "/data/backups");

// Command Definition:
module.exports = class BackupCreateCommand extends Command {
  constructor(client) {
    super(client, {
      name: "backup",
      aliases: ["bu"],
      description: "Create and charge a backup of the server",
      usage: "backup [create/info/load] <ID>",
      examples: ["backup create", "backup info 123456", "backup load 123456"],
      type: client.types.BACKUP,
    });
  }

  // Command Code:
  async run(message, args) {
    // Check if the user is the guild owner:
    if (message.guild.ownerId !== message.author.id)
      return await this.sendErrorMessage(
        message,
        3,
        "You must be the server owner to use this command!"
      );

    // Define the command arguments:
    const options = args[0];
    const backupID = args[1];

    // Create a switch statement to handle the command:
    switch (options) {
      // Create a backup:
      case "create":
        return backup
          .create(message.guild, {
            jsonBeautify: true,
          })
          .then(async (backupData) => {
            // Send the backup ID to MD:
            message.author.send({
              embeds: [
                new MessageEmbed()
                  .setAuthor({ name: `Backup created successfully!` })
                  .setColor(message.guild.me.displayHexColor)
                  .setDescription(
                    `To load backup, use ${await message.client.mongodb.settings.selectPrefix(
                      message.guild.id
                    )}backup load ${backupData.id}`
                  )
                  .setThumbnail(message.author.displayAvatarURL()),
              ],
            });
            // Send a success message to the channel:
            message.channel.send({
              embeds: [
                new MessageEmbed()
                  .setAuthor({ name: `Backup created successfully!` })
                  .setColor(message.guild.me.displayHexColor)
                  .setThumbnail(message.author.displayAvatarURL())
                  .setDescription("**The backup ID has been sent to the MD**"),
              ],
            });
          });
      // Info about the backup:
      case "info":
        // Check if the backup ID is valid:
        if (!backupID)
          return await this.sendErrorMessage(
            message,
            0,
            "Please specify a backup ID!"
          );
        // Fetch the backup
        return backup
          .fetch(backupID)
          .then((backupInfos) => {
            // Format the date:
            const date = new Date(backupInfos.data.createdTimestamp);
            const yyyy = date.getFullYear().toString(),
              mm = (date.getMonth() + 1).toString(),
              dd = date.getDate().toString();
            const formattedDate = `${yyyy}/${mm[1] ? mm : "0" + mm[0]}/${
              dd[1] ? dd : "0" + dd[0]
            }`;
            // Send the backup info to the channel:
            let embed = new MessageEmbed()
              .setAuthor({ name: "Backup Information's" })
              // Display the backup ID
              .addField("Backup ID", backupInfos.id, false)
              // Displays the server from which this backup comes
              .addField("Server ID", backupInfos.data.guildID, false)
              // Display the size (in mb) of the backup
              .addField("Size", `${backupInfos.size} mb`, false)
              // Display when the backup was created
              .addField("Created at", formattedDate, false)
              .setColor(message.guild.me.displayHexColor);
            return message.channel.send({ embeds: [embed] });
          })
          .catch(async () => {
            // if the backup wasn't found
            return await this.sendErrorMessage(message, 1, "Backup not found!");
          });
      // Load a backup:
      case "load":
        // Check if the backup ID is valid:
        if (!backupID)
          return await this.sendErrorMessage(
            message,
            0,
            "Please specify a backup ID!"
          );
        return backup.fetch(backupID).then(async () => {
          // If the backup exists, request for confirmation
          return message.channel
            .send({
              content:
                ":warning: | When the backup is loaded, all the channels, roles, etc. will be replaced! React with ✅ to confirm!",
            })
            .then((m) => {
              // Add the reaction to the message
              m.react("✅");
              const filter = (reaction, user) => {
                return (
                  ["✅"].includes(reaction.emoji.name) &&
                  user.id === message.author.id
                );
              };
              m.awaitReactions(filter, {
                max: 1,
                time: 20000,
                errors: ["time"],
              })
                .catch(() => {
                  // if the author of the commands does not confirm the backup loading
                  m.edit({
                    content: ":x: | Time's up! Cancelled backup loading!",
                  });
                })
                .then((collection) => {
                  const reaction = collection.first();
                  if (reaction.emoji.name === "✅") {
                    // When the author of the command has confirmed that he wants to load the backup on his server
                    message.author.send({
                      content: ":white_check_mark: | Start loading the backup!",
                    });
                    // Load the backup
                    backup
                      .load(backupID, message.guild)
                      .then(() => {
                        // When the backup is loaded, delete them from the server
                        backup.remove(backupID);
                      })
                      .catch(async () => {
                        // If an error occurred
                        return await this.sendErrorMessage(
                          message,
                          3,
                          "An error occurred, check if I have administrator permissions"
                        );
                      });
                  }
                });
            });
        });
      // If the command is not valid
      default:
        // Send an error message
        return await this.sendErrorMessage(
          message,
          0,
          `Invalid option! For more info, use ${await message.client.mongodb.settings.selectPrefix(
            message.guild.id
          )}help backup`
        );
    }
    
  }
};
