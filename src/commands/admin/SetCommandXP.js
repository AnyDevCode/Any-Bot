const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const {oneLine} = require("common-tags");

module.exports = class SetCommandPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcommandxp',
      aliases: ['setcxp', 'scxp'],
      usage: 'setcommandxp <xp count>',
      description: oneLine`
          Sets the amount of xp a user gets when they use a command.
          The default is 1.
          The maximum xp per command is equal to the xp plus 2. (If xp is 5, the max is 7)
          The minimum xp per command is equal to the xp minus 2. (If xp is 5, the min is 3 and if xp is 2 or less, the min is 0)
          `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setcommandxp 5']
    });
  }
  async run(message, args) {
    let amount = args[0];
    if (!amount || !Number.isInteger(Number(amount)) || amount < 0) 
      return await this.sendErrorMessage(message, 0, 'Please enter a positive integer');
    amount = Math.floor(amount);
    const {
      xpTracking: xpTracking, messageXP: xpMessages, commandXP: xpCommands, voiceXP: xpVoice
    } = await message.client.mongodb.settings.selectRow(message.guild.id);

    let old_minimum = Math.floor(xpCommands - 2);
    if (old_minimum < 0) old_minimum = 0;
    let old_maximum = Math.floor(xpCommands + 2);

    let new_minimum = Math.floor(amount - 2);
    if (new_minimum < 0) new_minimum = 0;
    let new_maximum = Math.floor(amount + 2);

    let minimum_message_xp = xpMessages - 2;
    if (minimum_message_xp < 0) minimum_message_xp = 0;
    let maximum_message_xp = xpMessages + 2;

    let minimum_voice_xp = xpVoice - 2;
    if (minimum_voice_xp < 0) minimum_voice_xp = 0;
    let maximum_voice_xp = xpVoice + 2;

    const status = message.client.utils.getStatus(xpTracking);
    await message.client.mongodb.settings.updateCommandXP(amount, message.guild.id);
    const embed = new MessageEmbed()
        .setTitle('Settings: `XP`')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(`The \`command XP\` value was successfully updated. ${success}`)
        .addField("Message XP", `\`Minimum: ${minimum_message_xp}\` - \`Maximum: ${maximum_message_xp}\``)
        .addField('Command XP', `\`Minimum: ${old_minimum}\` - \`Maximum: ${old_maximum}\` ➔ \`Minimum: ${new_minimum}\` - \`Maximum: ${new_maximum}\``)
        .addField('Voice XP', `\`Minimum: ${minimum_voice_xp}\` - \`Maximum: ${maximum_voice_xp}\``)
        .addField('Status', status)
        .setFooter({text:message.member.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })})
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
    message.channel.send({embeds: [embed]});
  }
};
