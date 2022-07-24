const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine } = require('common-tags');

module.exports = class SetVoicePointsVoice extends Command {
  constructor(client) {
    super(client, {
      name: 'setvoicexp',
      aliases: ['setvxp', 'svxp'],
      usage: 'setvoicexp <xp count>',
      description: oneLine`
        Sets the amount of voice xp a user gets for speaking in a voice channel every minute.
        The default is 1.
        The maximum xp per minute is equal to the xp plus 2. (If xp is 5, the max is 7)
        The minimum xp per minute is equal to the xp minus 2. (If xp is 5, the min is 3 and if xp is 2 or less, the min is 0)
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setvoicexp 5']
    });
  }
  async run(message, args) {
    let amount = args[0];
    if (!amount || !Number.isInteger(Number(amount)) || amount < 0) 
      return this.sendErrorMessage(message, 0, 'Please enter a positive integer');
    amount = Math.floor(amount);
    const {
      xpTracking: xpTracking, messageXP: xpMessages, commandXP: xpCommands, voiceXP: xpVoice
    } = await message.client.mongodb.settings.selectRow(message.guild.id);

    let old_minimum = Math.floor(xpVoice - 2);
    if (old_minimum < 0) old_minimum = 0;
    let old_maximum = Math.floor(xpVoice + 2);

    let new_minimum = Math.floor(amount - 2);
    if (new_minimum < 0) new_minimum = 0;
    let new_maximum = Math.floor(amount + 2);

    let minimum_xp_command = Math.floor(xpCommands - 2);
    if (minimum_xp_command < 0) minimum_xp_command = 0;
    let maximum_xp_command = Math.floor(xpCommands + 2);

    let minimum_xp_message = Math.floor(xpMessages - 2);
    if (minimum_xp_message < 0) minimum_xp_message = 0;
    let maximum_xp_message = Math.floor(xpMessages + 2);

    const status = message.client.utils.getStatus(xpTracking);
    await message.client.mongodb.settings.updateVoiceXP(amount, message.guild.id);
    const embed = new MessageEmbed()
        .setTitle('Settings: `XP`')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(`The \`command XP\` value was successfully updated. ${success}`)
        .addField("Message XP", `\`Minimum: ${minimum_xp_message}\` - \`Maximum: ${maximum_xp_message}\``)
        .addField('Command XP', `\`Minimum: ${minimum_xp_command}\` - \`Maximum: ${maximum_xp_command}\``)
        .addField('Voice XP', `\`Minimum: ${old_minimum}\` - \`Maximum: ${old_maximum}\` ➔ \`Minimum: ${new_minimum}\` - \`Maximum: ${new_maximum}\``)
        .addField('Status', status)
        .setFooter({text: message.member.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })})
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
    message.channel.send({embeds: [embed]});
  }
};
