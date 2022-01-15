const Command = require('../Command.js');
const {MessageEmbed} = require('discord.js');
const emojis = require('../../utils/emojis.json');
const {oneLine, stripIndent} = require('common-tags');

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: ['commands', 'h'],
            usage: 'help [command | all]',
            description: oneLine`
        Displays a list of all current commands, sorted by category.
        Can be used in conjunction with a command for additional information.
        Will only display commands that you have permission to access unless the \`all\` parameter is given.
      `,
            type: client.types.INFO,
            examples: ['help ping']
        });
    }

    run(message, args) {

        // Get disabled commands
        let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
        if (typeof (disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

        const all = (args[0] === 'all') ? args[0] : '';
        const embed = new MessageEmbed();
        const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
        const {
            INFO,
            FUN,
            ANIMALS,
            COLOR,
            POINTS,
            LEVELS,
            MISC,
            GAMES,
            SOCIAL,
            MOD,
            ADMIN,
            MUSIC,
            BACKUP,
            OWNER,
            NSFW
        } = message.client.types;
        const {capitalize} = message.client.utils;

        const modules = [
            INFO,
            FUN,
            ANIMALS,
            COLOR,
            POINTS,
            LEVELS,
            MISC,
            GAMES,
            SOCIAL,
            MOD,
            ADMIN,
            MUSIC,
            BACKUP,
            OWNER,
            NSFW
        ];

        let isModule = false;

        if (args[0]) {
            for (let i = 0; i < modules.length; i++) {
                if (modules[i].includes(args[0].toLowerCase())) {
                    isModule = true;
                }
            }
        }

      // Get commands
      const commands = {};
      for (const type of Object.values(message.client.types)) {
        commands[type] = [];
      }

      message.client.commands.forEach(command => {
        if (!disabledCommands.includes(command.name)) {
          if (command.userPermissions && command.userPermissions.every(p => message.member.hasPermission(p)) && !all)
            commands[command.type].push(`\`${command.name}\``);
          else if (!command.userPermissions || all) {
            commands[command.type].push(`\`${command.name}\``);
          }
        }
      });


        const command = message.client.commands.get(args[0]) || message.client.aliases.get(args[0]);
        if (
            command &&
            (command.type !== OWNER || message.client.isOwner(message.member)) &&
            !disabledCommands.includes(command.name)
        ) {

            embed // Build specific command help embed
                .setTitle(`Command: \`${command.name}\``)
                .setThumbnail('https://cdn.glitch.com/5bfb504c-974f-4460-ab6e-066acc7e4fa6%2Fezgif.com-gif-to-apng.png?v=1595260265531')
                .setDescription(command.description)
                .addField('Usage', `\`${prefix}${command.usage}\``, true)
                .addField('Type', `\`${capitalize(command.type)}\``, true)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                .setColor(message.guild.me.displayHexColor);
            if (command.aliases) embed.addField('Aliases', command.aliases.map(c => `\`${c}\``).join(' '));
            if (command.examples) embed.addField('Examples', command.examples.map(c => `\`${prefix}${c}\``).join('\n'));

        } else if (isModule) {
            embed
                .setTitle(`Commands: \`${args[0].toLowerCase()}\``)
                .setThumbnail('https://cdn.glitch.com/5bfb504c-974f-4460-ab6e-066acc7e4fa6%2Fezgif.com-gif-to-apng.png?v=1595260265531')
                .setFooter(message.member.displayName, message.author.displayAvatarURL({dynamic: true}))
                .setTimestamp()
                .setColor(message.guild.me.displayHexColor);
            for (let i = 0; i < modules.length; i++) {
                let isNsfw = false;
                let isOwner = false;
                if (modules[i].includes(args[0].toLowerCase())) {
                    embed.setDescription(message.client.commands.filter(c => c.type === modules[i]).map(c => {
                            if ((c.type === NSFW && !message.channel.nsfw)){
                              isNsfw = true;
                              return null;
                            };
                            if (disabledCommands.includes(c.name) || (c.type === OWNER && !message.client.isOwner(message.member))){
                              isOwner = true;
                              return null;
                            }
                            return `\`${c.name}\``
                        }).join(' '));
                }
                if (isNsfw) embed.setDescription(`**${capitalize(args[0].toLowerCase())}** is a NSFW module. You can only use it in NSFW channels.`);
                if (isOwner) embed.setDescription(`**${capitalize(args[0].toLowerCase())}** is an owner module. You can't use it.`);


            }
        } else if (args.length > 0 && !all) {
            return this.sendErrorMessage(message, 0, 'Unable to find command, please check provided command');

        } else {



            const emojiMap = {
                [INFO]: `${emojis.info} ${capitalize(INFO)}`,
                [FUN]: `${emojis.fun} ${capitalize(FUN)}`,
                [ANIMALS]: `${emojis.animals} ${capitalize(ANIMALS)}`,
                [COLOR]: `${emojis.color} ${capitalize(COLOR)}`,
                [POINTS]: `${emojis.points} ${capitalize(POINTS)}`,
                [LEVELS]: `${emojis.levels} ${capitalize(LEVELS)}`,
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

            const sectionsMap = {
                [INFO]: `${capitalize(INFO)}`,
                [FUN]: `${capitalize(FUN)}`,
                [ANIMALS]: `${capitalize(ANIMALS)}`,
                [COLOR]: `${capitalize(COLOR)}`,
                [POINTS]: `${capitalize(POINTS)}`,
                [LEVELS]: `${capitalize(LEVELS)}`,
                [MISC]: `${capitalize(MISC)}`,
                [GAMES]: `${capitalize(GAMES)}`,
                [SOCIAL]: `${capitalize(SOCIAL)}`,
                [MOD]: `${capitalize(MOD)}`,
                [ADMIN]: `${capitalize(ADMIN)}`,
                [MUSIC]: `${capitalize(MUSIC)}`,
                [BACKUP]: `${capitalize(BACKUP)}`,
                [OWNER]: `${capitalize(OWNER)}`,
                [NSFW]: `${capitalize(NSFW)}`
            };



            const total = Object.values(commands).reduce((a, b) => a + b.length, 0) - commands[OWNER].length;
            const size = message.client.commands.size - commands[OWNER].length;

            embed // Build help embed
                .setTitle('Any Bot\'s Seccions')
                .setDescription(stripIndent`
          **Prefix:** \`${prefix}\`
          **More Information for a command:** \`${prefix}help [command]\`
          **Total Commands:** ${size}
          ${(!all && size !== total) ? `**All Commands:** \`${prefix}help all\`` : ''}
        `)
                .setFooter(
                    (!all && size !== total) ?
                        'Only showing available categories.\n' + message.member.displayName : message.member.displayName,
                    message.author.displayAvatarURL({dynamic: true})
                )
                .setTimestamp()
                .setThumbnail('https://cdn.glitch.com/5bfb504c-974f-4460-ab6e-066acc7e4fa6%2Fezgif.com-gif-to-apng.png?v=1595260265531')
                .setColor(message.guild.me.displayHexColor);

            for (const type of Object.values(message.client.types)) {
                if (type === OWNER && !message.client.isOwner(message.member)) continue;
                if (type === NSFW && !message.channel.nsfw) continue;
                if (commands[type][0])
                    embed.addField(`**${emojiMap[type]} [${commands[type].length}]**`, `\`\`\`${prefix}help ${sectionsMap[type].toLowerCase()}\`\`\``, true);
            }

            embed.addField(
                '**Links**',
                '**[Invite Me](https://discordapp.com/oauth2/authorize?client_id=733728002910715977&scope=bot&permissions=8) | ' +
                '[Support Server](https://discord.gg/2FRpkNr) **'
            );

        }
        message.channel.send(embed);
    }
};
