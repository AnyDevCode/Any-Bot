const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { oneLine, stripIndents } = require("common-tags");

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
              stripIndents`
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

    // Get disabled commands
    let disabledCommands =
      (await client.mongodb.settings.selectDisabledCommands(
        message.guild.id
      )) || [];
    if (typeof disabledCommands === "string")
      disabledCommands = disabledCommands.split(" ");

    // Get points and XP
    let {
      pointTracking: pointTracking,
      messagePoints: messagePoints,
      commandPoints: commandPoints,
      xpTracking: xpTracking,
      messageXP: xpMessages,
      commandXP: xpCommands,
      xpMessageAction: xp_message_action,
      xpChannelID: xp_channel_id,
    } = await client.mongodb.settings.selectRow(message.guild.id);

    let { level, xp } = await client.mongodb.users.selectRow(
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
    const prefix = await client.mongodb.settings.selectPrefix(message.guild.id);
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${prefix.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      )})\\s*`
    );

    if (prefixRegex.test(message.content)) {
      // Get mod channels
      let modChannelIds =
        (await message.client.mongodb.settings.selectModChannelIds(
          message.guild.id
        )) || [];
      if (typeof modChannelIds === "string")
        modChannelIds = modChannelIds.split(" ");

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
          // Update points with commandPoints value
          if (pointTracking)
            await client.mongodb.users.updatePoints(
              { points: commandPoints },
              message.author.id,
              message.guild.id
            );
          if (xpTracking) {
            await client.mongodb.users.updateXP(
              { xp: xpCommands },
              message.author.id,
              message.guild.id
            );

            if (xp + xpCommands >= requiredXP) {
              await client.mongodb.users.updateLevel(
                { level: level + 1 },
                message.author.id,
                message.guild.id
              );
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

          await client.mongodb.users.updateTotalCommands(
            message.author.id,
            message.guild.id
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
            oneLine`
            You can add me to your server by clicking 
            [here](https://discordapp.com/oauth2/authorize?client_id=${message.guild.me.id}&scope=applications.commands%20bot&permissions=8)
          `
          )
          .addField(
            "Support",
            oneLine`
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

        message.channel.send({ embeds: [embed], components: [linkrow] });
      }
    }

    // Update the total messages
    await client.mongodb.users.updateTotalMessages(
      message.author.id,
      message.guild.id
    );

    // Update points with messagePoints value
    if (pointTracking)
      await client.mongodb.users.updatePoints(
        { points: messagePoints },
        message.author.id,
        message.guild.id
      );
    if (xpTracking) {
      await client.mongodb.users.updateXP(
        { xp: xpMessages },
        message.author.id,
        message.guild.id
      );
      if (xp + xpMessages >= requiredXP) {
        await client.mongodb.users.updateLevel(
          { level: level + 1 },
          message.author.id,
          message.guild.id
        );
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
  },
};
