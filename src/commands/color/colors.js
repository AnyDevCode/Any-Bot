const Command = require("../Command.js");
const ReactionMenu = require("../ReactionMenu.js");
const { MessageEmbed } = require("discord.js");

module.exports = class ColorsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "colors",
      aliases: ["colorlist", "colours", "cols", "cs"],
      usage: "colors",
      description: "Displays a list of all available colors.",
      type: client.types.COLOR,
      clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS"],
    });
  }
  async run(message) {
    const colors = Array.from(message.guild.roles.cache
      .filter((c) => c.name.startsWith("#"))
      .sort((a, b) => b.position - a.position).values())

    const embed = new MessageEmbed()
      .setTitle(`Available Colors [${colors.size}]`)
      .setFooter(
        {text: message.member.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })}
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    const prefix = await message.client.mongodb.settings.selectPrefix(message.guild.id); // Get prefix

    const interval = 50;
    if (colors.length === 0)
      message.channel.send(embed.setDescription("No colors found."));
    else if (colors.length <= interval) {
      const range = colors.length === 1 ? "[1]" : `[1 - ${colors.length}]`;
      message.channel.send({
        embeds: [
          embed
            .setTitle(`Available Colors ${range}`)
            .setDescription(
              `${colors.join(
                " "
              )}\n\nType \`${prefix}color <color name>\` to choose one.`
            ),
        ],
      });

      // Reaction Menu
    } else {
      let n = 0;
      const { getRange } = message.client.utils;
      embed
        .setTitle("Available Colors " + getRange(colors, n, interval))
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter({
          text: "Expires after two minutes.\n" + message.member.displayName,
          icon_url: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(`
          ${colors
            .slice(n, n + interval)
            .join(" ")}\n\nType \`${prefix}color <color name>\` to choose one.
        `);

      const json = embed.toJSON();

      const previous = () => {
        if (n === 0) return;
        n -= interval;
        return new MessageEmbed(json).setTitle(
          "Available Colors " + getRange(colors, n, interval)
        ).setDescription(`
            ${colors
              .slice(n, n + interval)
              .join(" ")}\n\nType \`${prefix}color <color name>\` to choose one.
          `);
      };

      const next = () => {
        const cap = colors.length - (colors.length % interval);
        if (n === cap || n + interval === colors.length) return;
        n += interval;
        if (n >= colors.length) n = cap;
        const max = colors.length > n + interval ? n + interval : colors.length;
        return new MessageEmbed(json)
          .setTitle("Available Colors " + getRange(colors, n, interval))
          .setDescription(
            `${colors
              .slice(n, max)
              .join(
                " "
              )}\n\nType \`${prefix}color <color name>\` to choose one.`
          );
      };

      const reactions = {
        "◀️": previous,
        "▶️": next,
        "⏹️": null,
      };

      const menu = new ReactionMenu(
        message.client,
        message.channel,
        message.member,
        embed,
        null,
        null,
        reactions
      );

      menu.reactions["⏹️"] = menu.stop.bind(menu);
    }
  }
};
