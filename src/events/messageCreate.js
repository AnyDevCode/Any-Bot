const {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} = require("discord.js");
const {
  oneLine,
  stripIndents
} = require("common-tags");
const fs = require("fs");
const {
  join
} = require("path");

let phisingLinks = null;
let cache_date;

function update_cache() {
  if (phisingLinks === null || Date.now() - cache_date > (1000 * 60 * 60)) {
    fs.readFile(join(__basedir, "data/PhishingLinks.json"), (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      phisingLinks = JSON.parse(data);
    })
    cache_date = Date.now();
  }
}

update_cache();

module.exports = {
  name: "messageCreate",
  async execute(message, commands, client, player) {
    if (message.channel.type === "DM" && !message.author.bot)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
          .setColor("#0099ff")
          .setTitle(`Hi, i am ${client.user.username}`)
          .setDescription(
            stripIndents `
            Please, use me in a server.
            If you want to know more about me, use the command \`@${client.user.username} help\` in a server.
            For more information about me, check out my [GitHub](https://github.com/MDCYT/Any-Bot).
            For Support and help, join the [Support Server](https://discord.gg/5UyuwbNu8j).
            For Terms and Conditions, visit the [Terms and Conditions](https://any-bot.tech/tos).
            `
          )
          .setFooter({
            text: `${client.user.username}`,
            iconURL: client.user.avatarURL(),
          })
          .setThumbnail(client.user.avatarURL())
          .setTimestamp(),
        ],
      });
    if (!message.channel.viewable || message.author.bot) return;

    //Check if message has image attachment
    const attachment = Array.from(message.attachments.values())[0];
    if (attachment && attachment.url) {
      const extension = attachment.url.split(".").pop();
      if (/(jpg|jpeg|png|gif)/gi.test(extension)) {
        client.mongodb.users.updateTotalImage(
          message.author.id,
          message.guild.id
        );
      }
    }

    // Get points, XP, disabled commands and prefix
    let {
      pointTracking: pointTracking,
      messagePoints: messagePoints,
      commandPoints: commandPoints,
      xpTracking: xpTracking,
      messageXP: xpMessages,
      commandXP: xpCommands,
      xpMessageAction: xp_message_action,
      xpChannelID: xp_channel_id,
      disabledCommands: disabledCommands,
      prefix: prefix,
      modChannelIDs: modChannelIds,
      antiPhishing: antiPhishing,
      antiPhishingLogsChannelID: antiPhishingLogsChannelId,
      antiPhishingSystem: antiPhishingSystem,
    } = await client.mongodb.settings.selectRow(message.guild.id);

    if (typeof disabledCommands !== "string") disabledCommands = [];
    if (typeof disabledCommands === "string")
      disabledCommands = disabledCommands.split(" ");

    if (typeof modChannelIds !== "string") modChannelIds = [];
    if (typeof modChannelIds === "string")
      modChannelIds = modChannelIds.split(" ");

    if (antiPhishing) {
      update_cache()

      // Match urls only
      // Example: https://discordapp.com/test/
      // Group 1: domain + path (discordapp.com/test)
      // Group 2: domain (discordapp.com)
      // Group 3: path (/test)
      const regex = /(?:(?:https?|ftp|mailto):\/\/)?(?:www\.)?(([^\/\s]+\.[a-z\.]+)(\/[^\s]*)?)(?:\/)?/ig;

      let susDomainsArgs = [];

      // Extract all the matched urls
      const theMessage = message.content;
      for (let match of theMessage.matchAll(regex)) {
        susDomainsArgs.push(match[2]);
      }

      // Check if the message contains a phishing link
      // PhishingLinks have a property called "domains", which is an array of domains
      // If the message contains a phishing link, the bot will send a message to the mod channel

      let phishingLink = false;

      for (let PhishingLink of phisingLinks.domains) {
        for (let domain of susDomainsArgs) {
          if (PhishingLink === domain) {
            phishingLink = true;
            break;
          }
        }
      }

      if (phishingLink) {
        const antiPhishingLogsChannel = message.guild.channels.cache.get(antiPhishingLogsChannelId);
        if (antiPhishingLogsChannel) {

          antiPhishingLogsChannel.send({
            embeds: [
              new MessageEmbed()
              .setTitle("Message Update: `Phishing Link Detected`")
              .setDescription(message.content)
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({
                  dynamic: true
                }),
              })
              .setTimestamp()
              .setColor(message.guild.me.displayHexColor)
              .setFooter({
                text: `${client.user.username}`,
                iconURL: client.user.avatarURL(),
              })

            ],
          });
        }


        switch (antiPhishingSystem) {
          case 0:
            break
          case 1:
            message.delete();
            break
          case 2:
            message.delete();
            //TimeOut the user for 1 week
            if (message.member.moderatable && message.member.manageable) message.member.timeout(1000 * 60 * 60 * 7, "Phishing Link - AutoMod")
            else message.channel.send({
              content: "The user " + message.author.tag + " is sending a phishing, please report this to the server owner or a mod.",
            })
            break
          case 3:
            message.delete();
            //Kick the user
            if (message.member.kickable && message.member.moderatable && message.member.manageable) message.member.kick("Phishing Link - AutoMod")
            else message.channel.send({
              content: "The user " + message.author.tag + " is sending a phishing, please report this to the server owner or a mod.",
            })
            break
          case 4:
            message.delete();
            //Ban the user
            if (message.member.bannable && message.member.moderatable && message.member.manageable) message.member.ban("Phishing Link - AutoMod")
            else message.channel.send({
              content: "The user " + message.author.tag + " is sending a phishing, please report this to the server owner or a mod.",
            })
            break
          default:
            break
        }

      }

    }

    let {
      level,
      xp
    } = await client.mongodb.users.selectRow(
      message.author.id,
      message.guild.id
    );

    if (!level) level = 0;

    let min_Messages_xp = Math.floor(xpMessages - 2);
    if (min_Messages_xp < 0) min_Messages_xp = 0;
    let max_Messages_xp = Math.floor(xpMessages + 2);

    let min_Commands_xp = Math.floor(xpCommands - 2);
    if (min_Commands_xp < 0) min_Commands_xp = 0;
    let max_Commands_xp = Math.floor(xpCommands + 2);

    xpMessages = Math.floor(
      Math.random() * (max_Messages_xp - min_Messages_xp + 1)
    );

    xpCommands = Math.floor(
      Math.random() * (max_Commands_xp - min_Commands_xp + 1)
    );

    const requiredXP = 50 * Math.pow(level, 2);

    // Command handler
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${prefix.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      )})\\s*`
    );

    if (prefixRegex.test(message.content)) {
      const [, match] = message.content.match(prefixRegex);
      const args = message.content.slice(match.length).trim().split(/ +/g);
      const cmd = args.shift().toLowerCase();
      let command = client.commands.get(cmd) || client.aliases.get(cmd); // If command not found, check aliases
      if (command && !disabledCommands.includes(command.name)) {
        // Check if mod channel
        if (modChannelIds.includes(message.channel.id)) {
          if (
            command.type !== client.types.MOD ||
            (command.type === client.types.MOD &&
              message.channel
              .permissionsFor(message.author)
              .missing(command.userPermissions) !== 0)
          )
            return; // Return early so Any Bot doesn't respond
        }

        // Check permissions
        const permission = command.checkPermissions(message);
        if (permission) {
          let NewPoints,
            NewXP,
            newLevel = 0;
          // Update points with commandPoints value
          if (pointTracking) NewPoints = commandPoints || 0;
          if (xpTracking) {
            NewXP = xpCommands || 0;

            if (xp + xpCommands >= requiredXP) {
              newLevel = 1;
              if (xp_message_action && xp_channel_id) {
                const xpChannel =
                  message.guild.channels.cache.get(xp_channel_id);
                if (xpChannel) {
                  xpChannel.send(
                    `${message.author} has leveled up to level ${level + 1}!`
                  );
                }
              }
            }
          }

          await client.mongodb.users.updateLevelXPPointsCommandsandMessages(
            message.author.id,
            message.guild.id, {
              level: newLevel || 0,
              xp: NewXP || 0,
              points: NewPoints || 0,
              total_commands: 1,
              total_messages: 0,
            }
          );

          message.command = true; // Add flag for messageUpdate event
          return command.run(message, args, client, player);
        }
      } else if (
        (message.content === `<@${client.user.id}>` ||
          message.content === `<@!${client.user.id}>`) &&
        message.channel
        .permissionsFor(message.guild.me)
        .has(["SEND_MESSAGES", "EMBED_LINKS"]) &&
        !modChannelIds.includes(message.channel.id)
      ) {
        const embed = new MessageEmbed()
          .setTitle(`Hi, I\'m ${message.guild.me.displayName}! Need help?`)
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription(
            `You can see everything I can do by using the \`${prefix}help\` command.`
          )
          .addField(
            "Invite Me",
            oneLine `
            You can add me to your server by clicking 
            [here](https://discordapp.com/oauth2/authorize?client_id=${message.guild.me.id}&scope=applications.commands%20bot&permissions=8)
          `
          )
          .addField(
            "Support",
            oneLine `
            If you have questions, suggestions, or found a bug, please join the 
            [${message.guild.me.displayName} Support Server](${message.client.supportServerInvite})
          `
          )
          .setColor(message.guild.me.displayHexColor);

        const linkrow = new MessageActionRow()
          .addComponents(
            new MessageButton()
            .setLabel("Invite Me")
            .setStyle("LINK")
            .setURL(
              `https://discordapp.com/oauth2/authorize?client_id=${message.guild.me.id}&scope=applications.commands%20bot&permissions=8`
            )
            .setEmoji("➡")
          )
          .addComponents(
            new MessageButton()
            .setLabel("Support Server")
            .setStyle("LINK")
            .setURL(message.client.supportServerInvite)
            .setEmoji("🛠️")
          );

        message.channel.send({
          embeds: [embed],
          components: [linkrow],
        });
      }
    }

    let NewPoints,
      NewXP,
      newLevel = 0;

    // Update points with messagePoints value
    if (pointTracking) NewPoints = messagePoints || 0;
    if (xpTracking) {
      NewXP = xpMessages || 0;
      if (xp + xpMessages >= requiredXP) {
        newLevel = 1;
        if (xp_message_action && xp_channel_id) {
          const xpChannel = message.guild.channels.cache.get(xp_channel_id);
          if (xpChannel) {
            xpChannel.send(
              `${message.author} has leveled up to level ${level + 1}!`
            );
          }
        }
      }
    }

    // Update the total messages
    await client.mongodb.users.updateLevelXPPointsCommandsandMessages(
      message.author.id,
      message.guild.id, {
        level: newLevel || 0,
        xp: NewXP || 0,
        points: NewPoints || 0,
        total_commands: 0,
        total_messages: 1,
      }
    );
  },
};
