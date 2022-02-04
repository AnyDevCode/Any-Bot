const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = async (client, message) => {

  if (message.channel.type === 'dm' || !message.channel.viewable || message.author.bot) return;

  //Check if message has image attachment
  const attachment = message.attachments.array()[0];
  if (attachment && attachment.url) {
    const extension = attachment.url.split('.').pop();
    if (/(jpg|jpeg|png|gif)/gi.test(extension)) {
      client.db.users.updateTotalImage.run(message.author.id, message.guild.id);
    }
  }

  // Get disabled commands
  let disabledCommands = client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
  if (typeof (disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

  // Get points
  const {point_tracking: pointTracking, message_points: messagePoints, command_points: commandPoints} =
      client.db.settings.selectPoints.get(message.guild.id);

  //Get XP
  let {
    xp_tracking: xpTracking,
    message_xp: xpMessages,
    command_xp: xpCommands,
    xp_message_action: xp_message_action,
    xp_channel_id: xp_channel_id
  } =
      client.db.settings.selectXP.get(message.guild.id);

  let min_Messages_xp = Math.floor(xpMessages - 2)
  if (min_Messages_xp < 0) min_Messages_xp = 0;
  let max_Messages_xp = Math.floor(xpMessages + 2)

  let min_Commands_xp = Math.floor(xpCommands - 2)
  if (min_Commands_xp < 0) min_Commands_xp = 0;
  let max_Commands_xp = Math.floor(xpCommands + 2)

  xpMessages = Math.floor(Math.random() * (max_Messages_xp - min_Messages_xp + 1)) + min_Messages_xp;
  xpCommands = Math.floor(Math.random() * (max_Commands_xp - min_Commands_xp + 1)) + min_Commands_xp;

  const level = client.db.users.selectLevel.get(message.author.id, message.guild.id);

  const requiredXP = 50 * Math.pow(level, 2)


  // Command handler
  const prefix = client.db.settings.selectPrefix.pluck().get(message.guild.id);
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`);

  if (prefixRegex.test(message.content)) {

    // Get mod channels
    let modChannelIds = message.client.db.settings.selectModChannelIds.pluck().get(message.guild.id) || [];
    if (typeof(modChannelIds) === 'string') modChannelIds = modChannelIds.split(' ');

    const [, match] = message.content.match(prefixRegex);
    const args = message.content.slice(match.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    let command = client.commands.get(cmd) || client.aliases.get(cmd); // If command not found, check aliases
    if (command && !disabledCommands.includes(command.name)) {
      // Check if mod channel
      if (modChannelIds.includes(message.channel.id)) {
        if (
            command.type !== client.types.MOD || (command.type === client.types.MOD &&
                message.channel.permissionsFor(message.author).missing(command.userPermissions) !== 0)
        ) {
          // Update points with messagePoints value
          if (pointTracking)
            client.db.users.updatePoints.run({points: messagePoints}, message.author.id, message.guild.id);
          if (xpTracking) {
            client.db.users.updateXP.run({xp: xpMessages}, message.author.id, message.guild.id);
            client.db.users.updateTotalMessages.run(message.author.id, message.guild.id);
          }
          if (client.db.users.selectXP.get(message.author.id, message.guild.id) >= requiredXP) {
            client.db.users.updateLevel.run({level: level + 1}, message.author.id, message.guild.id);
            if (xp_message_action && xp_channel_id) {
              const xpChannel = message.guild.channels.cache.get(xp_channel_id);
              if (xpChannel) {
                xpChannel.send(`${message.author} has leveled up to level ${level + 1}!`);
              }
            }
          }
          return; // Return early so Any Bot doesn't respond
        }
      }

      // Check permissions
      const permission = command.checkPermissions(message);
      if (permission) {

        // Update points with commandPoints value
        if (pointTracking)
          client.db.users.updatePoints.run({ points: commandPoints }, message.author.id, message.guild.id);
        if (xpTracking){
          client.db.users.updateXP.run({ xp: xpCommands }, message.author.id, message.guild.id);
          client.db.users.updateTotalCommands.run(message.author.id, message.guild.id);
        }
        if (client.db.users.selectXP.get(message.author.id, message.guild.id) >= requiredXP){
          client.db.users.updateLevel.run({level: level + 1}, message.author.id, message.guild.id);
          if (xp_message_action && xp_channel_id) {
            const xpChannel = message.guild.channels.cache.get(xp_channel_id);
            if (xpChannel) {
              xpChannel.send(`${message.author} has leveled up to level ${level + 1}!`);
            }
          }
        }

        message.command = true; // Add flag for messageUpdate event
        // Make a typing indicator for 2 seconds
        message.channel.startTyping()
        await new Promise(resolve => setTimeout(resolve, 500)).then(async () => await message.channel.stopTyping());
        return command.run(message, args); // Run command
      }
    } else if ( 
      (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) &&
      message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS']) &&
      !modChannelIds.includes(message.channel.id)
    ) {
      const embed = new MessageEmbed()
          .setTitle(`Hi, I\'m ${message.guild.me.displayName}! Need help?`)
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription(`You can see everything I can do by using the \`${prefix}help\` command.`)
          .addField('Invite Me', oneLine`
          You can add me to your server by clicking 
          [here](https://discordapp.com/oauth2/authorize?client_id=${message.guild.me.id}&scope=applications.commands%20bot&permissions=8)
        `)
          .addField('Support', oneLine`
          If you have questions, suggestions, or found a bug, please join the 
          [${message.guild.me.displayName} Support Server](${message.client.supportServerInvite})
        `)
          .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    }
  }

  // Update points with messagePoints value
  if (pointTracking) client.db.users.updatePoints.run({ points: messagePoints }, message.author.id, message.guild.id);
  if (xpTracking) {
    client.db.users.updateXP.run({ xp: xpMessages }, message.author.id, message.guild.id);
    client.db.users.updateTotalMessages.run(message.author.id, message.guild.id);
  }
  if (client.db.users.selectXP.get(message.author.id, message.guild.id) >= requiredXP) {
    client.db.users.updateLevel.run({ level: level + 1 }, message.author.id, message.guild.id);
      if (xp_message_action && xp_channel_id) {
        const xpChannel = message.guild.channels.cache.get(xp_channel_id);
        if (xpChannel) {
          xpChannel.send(`${message.author} has leveled up to level ${level + 1}!`);
        }
      }
    }
};

