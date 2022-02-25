const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");

module.exports = class QueueMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: "queue",
      usage: "queue <page>",
      aliases: ["list"],
      description: "Shows the current queue",
      examples: ["queue", "queue 2"],
      type: client.types.MUSIC,
    });
  }
  async run(message, args, client, player) {
    const queue = player.getQueue(message.guild.id);
    if (!queue || !queue.playing)
      return message.reply(`❌ | There is nothing playing.`);
    const page = parseInt(args[0]) || 1;
    const pageStart = 10 * (page - 1);
    const pageEnd = pageStart + 10;
    const currentTrack = queue.current;
    const tracks = queue.tracks.slice(pageStart, pageEnd).map((m, i) => {
      return `${i + pageStart + 1}. **${m.title}** ([link](${m.url}))`;
    });

    const embed = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setAuthor({
        name: `${message.guild.name} Music Queue`,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setDescription(
        `${tracks.join("\n")}${
          queue.tracks.length > pageEnd
            ? `\n...${queue.tracks.length - pageEnd} more track(s)`
            : ""
        }`
      )
      .addField(
        "Now Plating",
        `🎶 | **${currentTrack.title}** ([link](${currentTrack.url}))`
      )

      .setFooter({
        text: `${message.guild.name}`,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setTimestamp();
    return message.reply({ embeds: [embed] });
  }
};
