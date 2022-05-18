const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success, fail } = require('../../utils/emojis.json');
const { oneLine } = require('common-tags');

module.exports = class ToggleCommandCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'togglecommand',
      aliases: ['togglec', 'togc', 'tc'],
      usage: 'togglecommand <command>',
      description: oneLine`
        Enables or disables the provided command. 
        Disabled commands will no longer be able to be used, and will no longer show up with the \`help\` command.
        \`${client.utils.capitalize(client.types.ADMIN)}\` commands cannot be disabled.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['togglecommand ping']
    });
  }
  async run(message, args) {

    const { ADMIN, OWNER } = message.client.types;

    const command = message.client.commands.get(args[0]) || message.client.aliases.get(args[0]);
    if (!command || (command && command.type === OWNER))
      return this.sendErrorMessage(message, 0, 'Please provide a valid command');

    const { capitalize } = message.client.utils;

    if (command.type === ADMIN) 
      return this.sendErrorMessage(message, 0, `${capitalize(ADMIN)} commands cannot be disabled`);

    let disabledCommands = await message.client.mongodb.settings.selectDisabledCommands(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    let description;

    // Disable command
    if (!disabledCommands.includes(command.name)) {
      disabledCommands.push(command.name); // Add to array if not present
      description = `The \`${command.name}\` command has been successfully **disabled**. ${fail}`;
    
    // Enable command
    } else {
      message.client.utils.removeElement(disabledCommands, command.name);
      description = `The \`${command.name}\` command has been successfully **enabled**. ${success}`;
    }

    await message.client.mongodb.settings.updateDisabledCommands(disabledCommands.join(' '), message.guild.id);

    disabledCommands = disabledCommands.map(c => `\`${c}\``).join(' ') || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(description)
      .addField('Disabled Commands', disabledCommands, true)
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })      
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({embeds: [embed]});
  }
};
