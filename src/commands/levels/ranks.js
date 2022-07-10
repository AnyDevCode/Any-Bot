const Command = require("../Command.js");
const ReactionMenu = require("../ReactionMenu.js");
const {MessageEmbed} = require("discord.js");
const {oneLine} = require("common-tags");

module.exports = class RanksCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ranks",
      usage: "ranks [member count]",
      description: oneLine`
        Displays the server xp leaderboard of the provided member count. 
        If no member count is given, the leaderboard will default to size 10.
        The max leaderboard size is 25.
      `,
      type: client.types.LEVELS,
      clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS"],
      examples: ["ranks 20"],
    });
  }
  async run(message, args) {
    // Check if user is in a voice channel
    if (message.member.voice.channel)
      return await this.sendErrorMessage(
          message,
          1,
          "Because a limitation of the API, you can't use this command in a voice channel."
      );
    let max = parseInt(args[0]);
    if (!max || max < 0) max = 10;
    else if (max > 25) max = 25;
    let leaderboard = await message.client.mongodb.users.selectRankXP(message.guild.id);
    const position = leaderboard
        .map((row) => row.user_id)
        .indexOf(message.author.id);

    const members = [];
    let count = 1;
    for (const row of leaderboard) {
      members.push(oneLine`
        **${count}.** ${await message.guild.members.cache.get(
          row.user_id
      )} - XP: ${row.total_xp} - Level: ${row.level}
      `);
      count++;
    }

    const embed = new MessageEmbed()
        .setThumbnail(message.guild.iconURL({dynamic: true}))
        .setFooter({
          text: `${message.member.displayName}'s position: ${position + 1}`,
          iconURL: message.author.displayAvatarURL({dynamic: true}),
        })
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);

    if (members.length <= max) {
      const range = members.length === 1 ? "[1]" : `[1 - ${members.length}]`;
      message.channel.send(
          {
            embeds:[embed
              .setTitle(`XP Leaderboard ${range}`)
              .setDescription(members.join("\n"))
      ]
          });

      // Reaction Menu
    } else {
      embed
          .setTitle("XP Leaderboard")
          .setThumbnail(message.guild.iconURL({dynamic: true}))
          .setFooter({
            text: "Expires after two minutes.\n" +
            `${message.member.displayName}'s position: ${position + 1}`,
            iconURL: message.author.displayAvatarURL({dynamic: true}),
          });

      new ReactionMenu(
          message.client,
          message.channel,
          message.member,
          embed,
          members,
          max
      );
    }
  }
};
