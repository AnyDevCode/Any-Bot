const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { stripIndent, oneLine } = require('common-tags');

module.exports = class SettingsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      aliases: ['set', 's', 'config', 'conf'],
      usage: 'settings [category]',
      description: oneLine`
        Displays a list of all current settings for the given setting category. 
        If no category is given, the amount of settings for every category will be displayed.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['settings System']
    });
  }
  async run(message, args) {

    const { trimArray, replaceKeywords, replaceCrownKeywords } = message.client.utils;

    // Set values
    const row = await message.client.mongodb.settings.selectRow(message.guild.id);
    const prefix = `\`${row.prefix}\``;
    const systemChannel = message.guild.channels.cache.get(row.systemChannelID) || '`None`';
    const starboardChannel = message.guild.channels.cache.get(row.starboardChannelID) || '`None`';
    const modLog = message.guild.channels.cache.get(row.modLogID) || '`None`';
    const memberLog = message.guild.channels.cache.get(row.memberLogID) || '`None`';
    const nicknameLog = message.guild.channels.cache.get(row.nicknameLogID) || '`None`';
    const roleLog = message.guild.channels.cache.get(row.roleLogID) || '`None`';
    const messageEditLog = message.guild.channels.cache.get(row.messageEditLogID) || '`None`';
    const messageDeleteLog = message.guild.channels.cache.get(row.messageDeleteLogID) || '`None`';
    const verificationChannel = message.guild.channels.cache.get(row.verificationChannelID) || '`None`';
    const welcomeChannel = (message.guild.channels.cache.get(row.welcomeChannelID)) ? `<#${(message.guild.channels.cache.get(row.welcomeChannelID)).id}>` : '`None`'  || '`None`';
    const farewellChannel = (message.guild.channels.cache.get(row.farewellChannelID)) ? `<#${(message.guild.channels.cache.get(row.farewellChannelID)).id}>` : '`None`' || '`None`';
    const crownChannel = message.guild.channels.cache.get(row.crownChannelID) || '`None`';
    const xpChannel = message.guild.channels.cache.get(row.xpChannelID) || '`None`';
    const xpChannelAction = row.xpMessageAction;
    const XPStatus = message.client.utils.getStatus(
        xpChannelAction
    );
    let modChannels = [];
    if (row.modChannelIDs) {
      for (const channel of row.modChannelIDs.split(' ')) {
        modChannels.push(message.guild.channels.cache.get(channel));
      }
      modChannels = trimArray(modChannels).join(' ');
    }
    if (modChannels.length === 0) modChannels = '`None`';
    const adminRole = message.guild.roles.cache.get(row.adminRoleID) || '`None`';
    const modRole = message.guild.roles.cache.get(row.modRoleID) || '`None`';
    const muteRole = message.guild.roles.cache.get(row.mutedRoleID) || '`None`';
    const autoRole = message.guild.roles.cache.get(row.autoRoleID) || '`None`';
    const verificationRole = message.guild.roles.cache.get(row.verificationRoleID) || '`None`';
    const crownRole = (message.guild.roles.cache.get(row.crownRoleID) ? `${message.guild.roles.cache.get(row.crownRoleID)}` : '`None`' ) || '`None`';
    const autoKick = (row.autoKick) ? `After \`${row.autoKick}\` warn(s)` : '`disabled`';
    const autoBan = (row.autoBan) ? `After \`${row.autoBan}\` warn(s)` : '`disabled`';
    const messagePoints = `\`${row.messagePoints}\``;
    const commandPoints = `\`${row.commandPoints}\``;
    const voicePoints = `\`${row.voicePoints}\``;
    let minimum_xp_message_raw = Math.floor(row.messageXP - 2);
    if (minimum_xp_message_raw < 0) minimum_xp_message_raw = 0;
    let maximum_xp_message_raw = Math.floor(row.messageXP + 2);
    let minimum_xp_command_raw = Math.floor(row.commandXP - 2);
    if (minimum_xp_command_raw < 0) minimum_xp_command_raw = 0;
    let maximum_xp_command_raw = Math.floor(row.commandXP + 2);
    let minimum_xp_voice_raw = Math.floor(row.voiceXP - 2);
    if (minimum_xp_voice_raw < 0) minimum_xp_voice_raw = 0;
    let maximum_xp_voice_raw = Math.floor(row.voiceXP + 2);

    const messageXP = `\`Minimum: ${minimum_xp_message_raw}\` - \`Maximum: ${maximum_xp_message_raw}\``
    const commandXP = `\`Minimum: ${minimum_xp_command_raw}\` - \`Maximum: ${maximum_xp_command_raw}\``
    const voiceXP = `\`Minimum: ${minimum_xp_voice_raw}\` - \`Maximum: ${maximum_xp_voice_raw}\``


    let verificationMessage = (row.verificationMessage) ? replaceKeywords(row.verificationMessage) : '`None`';
    let welcomeMessage = ((row.welcomeMessage[0].data.text ? row.welcomeMessage[0].data.text : null) ? replaceKeywords(row.welcomeMessage[0].data.text) : '`None`');
    let farewellMessage = ((row.welcomeMessage[0].data.text ? row.farewellMessage[0].data.text : null) ? replaceKeywords(row.farewellMessage[0].data.text ) : '`None`');
    let crownMessage = (row.crownMessage[0].data.message) ? replaceCrownKeywords(row.crownMessage[0].data.message) : '`None`';
    const crownSchedule = (row.crownSchedule) ? `\`${row.crownSchedule}\`` : '`None`';
    let disabledCommands = '`None`';
    if (row.disabledCommands) 
      disabledCommands = row.disabledCommands.split(' ').map(c => `\`${c}\``).join(' ');

    // Get statuses
    const verificationStatus = `\`${message.client.utils.getStatus(
      row.verificationRoleID && row.verificationChannelID && row.verificationMessage
    )}\``;
    const randomColor = `\`${message.client.utils.getStatus(row.randomColor)}\``;
    const welcomeStatus = `\`${message.client.utils.getStatus((row.welcomeMessage ? row.welcomeMessage[0] : null) && row.welcomeChannelID)}\``;
    const farewellStatus = `\`${message.client.utils.getStatus((row.farewellMessage ? row.farewellMessage[0] : null) && row.farewellChannelID)}\``;
    const pointsStatus = `\`${message.client.utils.getStatus(row.pointTracking)}\``;
    const xpStatus = `\`${message.client.utils.getStatus(row.xpTracking)}\``;
    const crownStatus = `\`${message.client.utils.getStatus(row.crownRoleID && row.crownSchedule)}\``;
    
    // Trim messages to 1024 characters
    if (verificationMessage.length > 1024) verificationMessage = verificationMessage.slice(0, 1021) + '...';
    if (welcomeMessage.length > 1024) welcomeMessage = welcomeMessage.slice(0, 1021) + '...';
    if (farewellMessage.length > 1024) farewellMessage = farewellMessage.slice(0, 1021) + '...';
    if (crownMessage.length > 1024) crownMessage = crownMessage.slice(0, 1021) + '...';

    /** ------------------------------------------------------------------------------------------------
     * CATEGORY CHECKS
     * ------------------------------------------------------------------------------------------------ */
    let setting = args.join('').toLowerCase();
    if (setting.endsWith('setting')) setting = setting.slice(0, -7);
    const embed = new MessageEmbed()
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter({text: message.member.displayName, icon_url: message.author.displayAvatarURL({ dynamic: true })})
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    switch (setting) {
      case 's':
      case 'sys':
      case 'system':
        embed
        .setTitle('Settings: `System`')
        .addField('Prefix', prefix, true)
        .addField('System Channel', systemChannel ? `${systemChannel}` : '`None`', true)
        .addField('Starboard Channel', starboardChannel  ? `${starboardChannel}` : '`None`', true)
        .addField('Admin Role', adminRole  ? `${adminRole}` : '`None`', true)
        .addField('Mod Role', modRole  ? `${modRole}` : '`None`', true)
        .addField('Mute Role', muteRole  ? `${muteRole}` : '`None`', true)
        .addField('Auto Role', autoRole  ? `${autoRole}` : '`None`', true)
        .addField('Auto Kick', autoKick  ? `${autoKick}` : '`None`', true)
        .addField('Auto Ban', autoBan  ? `${autoBan}` : '`None`', true)
        .addField('Random Color', randomColor  ? `${randomColor}` : '`None`', true)
        .addField('Mod Channels', modChannels  ? `${modChannels}` : '`None`')
        .addField('Disabled Commands', disabledCommands  ? `${disabledCommands}` : '`None`')
        return message.channel.send({embeds:[embed]});
      case 'l':
      case 'log':
      case 'logs':
      case 'logging':
        embed
        .setTitle('Settings: `Logging`')
        .addField('Mod Log', modLog ? `${modLog}` : '`None`', true)
        .addField('Member Log', memberLog ? `${memberLog}` : '`None`', true)
        .addField('Nickname Log', nicknameLog ? `${nicknameLog}` : '`None`', true)
        .addField('Role Log', roleLog ? `${roleLog}` : '`None`', true)
        .addField('Message Edit Log', messageEditLog ? `${messageEditLog}` : '`None`', true)
        .addField('Message Delete Log', messageDeleteLog ? `${messageDeleteLog}` : '`None`', true)
        return message.channel.send({
          embeds:[embed]
        });
      case 'v':
      case 'ver':
      case 'verif':
      case 'verification':
        embed
          .setTitle('Settings: `Verification`')
          .addField('Role', verificationRole, true)
          .addField('Channel', verificationChannel, true)
          .addField('Status', verificationStatus, true)
          .addField('Message', verificationMessage);
        return message.channel.send({embeds: [embed]});
      case 'w':
      case 'welcome':
      case 'welcomes':
        embed
          .setTitle('Settings: `Welcomes`')
          .addField('Channel', welcomeChannel, true)
          .addField('Status', welcomeStatus, true)
          .addField('Message', welcomeMessage);
        return message.channel.send({embeds: [embed]});
      case 'f':
      case 'farewell':
      case 'farewells':
        embed
          .setTitle('Settings: `Farewells`')
          .addField('Channel', farewellChannel, true)
          .addField('Status', farewellStatus, true)
          .addField('Message', farewellMessage);
        return message.channel.send({embeds: [embed]});
      case 'p':
      case 'point':
      case 'points':
        embed
          .setTitle('Settings: `Points`')
          .addField('Message Points', messagePoints, true)
          .addField('Command Points', commandPoints, true)
          .addField('Voice Points', voicePoints, true)
          .addField('Status', pointsStatus)
        return message.channel.send({embeds:[
          embed
        ]}
        );
      case 'x':
      case 'xp':
      case 'rank':
      case 'ranks':
        embed
          .setTitle('Settings: `Ranks`')
          .addField('Channel', xpChannel)
            .addField("Send message to channel", `\`${XPStatus}\``)
            .addField("Message XP", messageXP)
            .addField("Command XP", commandXP)
            .addField("Voice XP", voiceXP)
            .addField("Status", xpStatus)
        return message.channel.send(
          {embeds:[
            embed
          ]}
        );
      case 'c':
      case 'crown':
        embed
          .setTitle('Settings: `Crown`')
          .addField('Role', crownRole, true)
          .addField('Channel', crownChannel, true)
          .addField('Schedule', crownSchedule, true)
          .addField('Status', crownStatus)
          .addField('Message', crownMessage);
        return message.channel.send({embeds: [embed]});
    }
    if (setting)
      return await this.sendErrorMessage(message, 0, stripIndent`
        Please enter a valid settings category, use ${row.prefix}settings for a list
      `);

    /** ------------------------------------------------------------------------------------------------
     * FULL SETTINGS
     * ------------------------------------------------------------------------------------------------ */

    embed
      .setTitle('Settings')
      .setDescription(`**More Information:** \`${row.prefix}settings [category]\``)
      .addField('System', '`11` settings', true)
      .addField('Logging', '`6` settings', true)
      .addField('Verification', '`3` settings', true)
      .addField('Welcomes', '`2` settings', true)
      .addField('Farewells', '`2` settings', true)
      .addField('Points', '`3` settings', true)
      .addField('XP', '`3` settings', true)
      .addField('Crown', '`4` settings', true);

    message.channel.send({embeds: [embed]});
  }
};