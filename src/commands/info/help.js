const Command = require("../Command.js");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require("discord.js");
const emojis = require("../../utils/emojis.json");
const { oneLine, stripIndent } = require("common-tags");

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      aliases: ["commands", "h"],
      usage: "help [command | all]",
      description: oneLine`
        Displays a list of all current commands, sorted by category.
        Can be used in conjunction with a command for additional information.
        Will only display commands that you have permission to access unless the \`all\` parameter is given.
      `,
      type: client.types.INFO,
      examples: ["help ping"],
    });
  }

  async run(message, args) {
    let modules_list = []

    // Get disabled commands
    let disabledCommands =
      await message.client.mongodb.settings.selectDisabledCommands(message.guild.id) || [];
    if (typeof disabledCommands === "string")
      disabledCommands = disabledCommands.split(" ");

    const all = args[0] === "all" ? args[0] : "";
    const embed = new MessageEmbed();
    const prefix = await message.client.mongodb.settings.selectPrefix(message.guild.id);
    const {
      INFO,
      FUN,
      UTILS,
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
      NSFW,
    } = message.client.types;
    const { capitalize } = message.client.utils;

    const modules = [
      INFO,
      FUN,
      UTILS,
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
      NSFW,
    ];

    let isModule = false;

    if (args[0]) {
      if (args[0].toLowerCase() === "-m") {
        if (args[1]) {
          //Check if module exists
          if (modules.includes(args[1].toLowerCase())) {
            isModule = true;
          } else {
            return message.reply({
              content: `Module \`${args[1]}\` does not exist.`,
            });
          }
        } else {
          return message.reply({
            content: "Please specify a module.",
          });
        }
      }
    }

    // Get commands
    const commands = {};
    for (const type of Object.values(message.client.types)) {
      commands[type] = [];
    }

    message.client.commands.forEach((command) => {
      if (!disabledCommands.includes((command.name).toLowerCase())) {
        if (
          command.userPermissions &&
          command.userPermissions.every((p) =>
            message.member.permissions.has(p)
          ) &&
          !all
        )
          commands[command.type].push(`\`${command.name}\``);
        else if (!command.userPermissions || all) {
          commands[command.type].push(`\`${command.name}\``);
        }
      }
    });

    const command =
      message.client.commands.get(args[0]) ||
      message.client.aliases.get(args[0]);
    if (
      command &&
      (command.type !== OWNER || message.client.isOwner(message.member)) &&
      !disabledCommands.includes(command.name)
    ) {
      embed // Build specific command help embed
        .setTitle(`Command: \`${command.name}\``)
        .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))
        .setDescription(command.description)
        .addField("Usage", `\`${prefix}${command.usage}\``, true)
        .addField("Type", `\`${capitalize(command.type)}\``, true)
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      if (command.aliases)
        embed.addField(
          "Aliases",
          command.aliases.map((c) => `\`${c}\``).join(" ")
        );
      if (command.examples)
        embed.addField(
          "Examples",
          command.examples.map((c) => `\`${prefix}${c}\``).join("\n")
        );
    } else if (isModule) {
      embed
        .setTitle(`Commands: \`${args[1].toLowerCase()}\``)
        .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      for (let i = 0; i < modules.length; i++) {
        let isNsfw = false;
        let isOwner = false;
        if (modules[i].includes(args[1].toLowerCase())) {
          embed.setDescription(
            message.client.commands
              .filter((c) => c.type === modules[i])
              .map((c) => {
                if (c.type === NSFW && !message.channel.nsfw) {
                  isNsfw = true;
                  return null;
                }
                if (
                  disabledCommands.includes(c.name) ||
                  (c.type === OWNER && !message.client.isOwner(message.member))
                ) {
                  isOwner = true;
                  return null;
                }
                return `\`${c.name}\``;
              })
              .join(" ")
          );
        }
        if (isNsfw)
          embed.setDescription(
            `**${capitalize(
              args[1].toLowerCase()
            )}** is a NSFW module. You can only use it in NSFW channels.`
          );
        if (isOwner)
          embed.setDescription(
            `**${capitalize(
              args[1].toLowerCase()
            )}** is an owner module. You can't use it.`
          );
      }
    } else if (args.length > 0 && !all) {
      return this.sendErrorMessage(
        message,
        0,
        "Unable to find command, please check provided command"
      );
    } else {
      const emojiMap = {
        [INFO]: `${emojis.info} ${capitalize(INFO)}`,
        [FUN]: `${emojis.fun} ${capitalize(FUN)}`,
        [UTILS]: `${emojis.utils} ${capitalize(UTILS)}`,
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
        [NSFW]: `${emojis.nsfw} ${capitalize(NSFW)}`,
      };

      const sectionsMap = {
        [INFO]: `${capitalize(INFO)}`,
        [FUN]: `${capitalize(FUN)}`,
        [UTILS]: `${capitalize(UTILS)}`,
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
        [NSFW]: `${capitalize(NSFW)}`,
      };

      const total =
        Object.values(commands).reduce((a, b) => a + b.length, 0) -
        commands[OWNER].length;
      const size = message.client.commands.size - commands[OWNER].length;

      embed // Build help embed
        .setTitle(`${message.client.user.username}\'s Seccions`)
        .setDescription(
          stripIndent`
          **Prefix:** \`${prefix}\`
          **More Information for a command:** \`${prefix}help [command]\`
          **Total Commands:** ${size}
          ${
            !all && size !== total
              ? `**All Commands:** \`${prefix}help all\``
              : ""
          }
        `
        )
        .setFooter({
          text:
            !all && size !== total
              ? "Only showing available categories.\n" +
                message.member.displayName
              : message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp()
        .setThumbnail(
          message.client.user.displayAvatarURL({ dynamic: true, size: 1024 })
        )
        .setColor(message.guild.me.displayHexColor);

      for (const type of Object.values(message.client.types)) {
        if (type === OWNER && !message.client.isOwner(message.member)) continue;
        if (type === NSFW && !message.channel.nsfw) continue;
        if (commands[type][0])
          embed.addField(
            `**${emojiMap[type]} [${commands[type].length}]**`,
            `\`\`\`${prefix}help -m ${sectionsMap[type].toLowerCase()}\`\`\``,
            true
          );

          //Make a object with all the modules
          /*Example:             {
              label: "Admin",
              description: "Admin commands",
              value: "admin",
              emoji: `${emojis.admin}`,
            },
            */
            modules_list.push({
              label: `${capitalize(type)}`,
              description: `${capitalize(type)} commands`,
              value: `${capitalize(type)}`,
              emoji: `${emojiMap[type].split(" ")[0]}`,
            });
      }

      embed.addField(
        "**Links**",
        `**[Invite Me](https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot%20applications.commands&permissions=8) | ` +
          `[Support Server](${message.client.supportServerInvite}) **`
      );
    }

    let linkrow;

    if (args.length > 0) {
      linkrow = new MessageActionRow().addComponents(
        new MessageButton()
          .setLabel("Invite Me")
          .setStyle("LINK")
          .setURL(
            `https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot%20applications.commands&permissions=8`
          )
          .setEmoji("🔗"),
        new MessageButton()
          .setLabel("Support Server")
          .setStyle("LINK")
          .setURL(message.client.supportServerInvite)
          .setEmoji("🛡")
      );
    } else {
      linkrow = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("help-menu")
          .setPlaceholder("Select a category")
          .addOptions(modules_list)
      );
    }

    message.reply({ embeds: [embed], components: [linkrow], ephemeral: true });
  }
};
