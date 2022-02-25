const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class AliasesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'aliases',
      aliases: ['alias', 'ali', 'a'],
      usage: 'aliases [command type]',
      description: oneLine`
        Displays a list of all current aliases for the given command type. 
        If no command type is given, the amount of aliases for every type will be displayed.
      `,
      type: client.types.INFO,
      examples: ['aliases Fun']
    });
  }
  run(message, args) {

    // Get disabled commands
    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    const aliases = {};
    const embed = new MessageEmbed();
    for (const type of Object.values(message.client.types)) {
      aliases[type] = [];
    }

    const type = (args[0]) ? args[0].toLowerCase() : '';
    const types = Object.values(message.client.types);
    const { INFO, FUN, ANIMALS, COLOR, POINTS, MISC, GAMES, SOCIAL, MOD, ADMIN, MUSIC, BACKUP, OWNER, NSFW } = message.client.types;
    const { capitalize } = message.client.utils;

    const emojiMap = {
      [INFO]: `${emojis.info} ${capitalize(INFO)}`,
      [FUN]: `${emojis.fun} ${capitalize(FUN)}`,
      [ANIMALS]: `${emojis.animals} ${capitalize(ANIMALS)}`,
      [COLOR]: `${emojis.color} ${capitalize(COLOR)}`,
      [POINTS]: `${emojis.points} ${capitalize(POINTS)}`,
      [MISC]: `${emojis.misc} ${capitalize(MISC)}`,
      [GAMES]: `${emojis.games} ${capitalize(GAMES)}`,
      [SOCIAL]: `${emojis.social} ${capitalize(SOCIAL)}`,
      [MOD]: `${emojis.mod} ${capitalize(MOD)}`,
      [ADMIN]: `${emojis.admin} ${capitalize(ADMIN)}`,
      [MUSIC]: `${emojis.music} ${capitalize(MUSIC)}`,
      [BACKUP]: `${emojis.backup} ${capitalize(BACKUP)}`,
      [OWNER]: `${emojis.owner} ${capitalize(OWNER)}`,
      [NSFW]: `${emojis.nsfw} ${capitalize(NSFW)}`
    };
    
    if (args[0] && types.includes(type) && (type !== OWNER || message.client.isOwner(message.member))) {
      
      message.client.commands.forEach(command => {
        if (command.aliases && command.type === type && !disabledCommands.includes(command.name)) 
          aliases[command.type].push(`**${command.name}:** ${command.aliases.map(a => `\`${a}\``).join(' ')}`);
      });

      embed
        .setTitle(`Alias Type: \`${capitalize(type)}\``)
        .setThumbnail('https://cdn.glitch.com/5bfb504c-974f-4460-ab6e-066acc7e4fa6%2Fezgif.com-gif-to-apng.png?v=1595260265531')
        .addField(
          `**${emojiMap[type]} [${aliases[type].reduce((a, b) => a + b.split(' ').slice(1).length, 0)}]**`, 
          aliases[type].join('\n')
        )
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);

    } else if (type) {
      return this.sendErrorMessage(message, 0, 'Unable to find command type, please check provided type');

    } else {

      message.client.commands.forEach(command => {
        if (command.aliases && !disabledCommands.includes(command.name)) 
          aliases[command.type].push(`**${command.name}:** ${command.aliases.map(a => `\`${a}\``).join(' ')}`);
      });

      const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);

      embed
        .setTitle(`${message.client.user.username}\'s Alias Types`)
        .setDescription(stripIndent`
          **Prefix:** \`${prefix}\`
          **More Information:** \`${prefix}aliases [command type]\`
        `)
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);

      for (const type of Object.values(message.client.types)) {
        if (type === OWNER && !message.client.isOwner(message.member)) continue;
        if (type === NSFW && !message.channel.nsfw) continue;
        if (aliases[type][0]) 
          embed.addField(
            `**${emojiMap[type]}**`, `
            \`${aliases[type].reduce((a, b) => a + b.split(' ').slice(1).length, 0)}\` aliases`, 
            true
          );
      }

      embed.addField(
          '**Links**',
          `**[Invite Me](https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot%20applications.commands&permissions=8) | ` +
          `[Support Server](${message.client.supportServerInvite}) **`
      );

    }

    message.channel.send(embed);
  }
};
