const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
module.exports = class AvatarCommand extends Command {
  constructor(client) {
    super(client, {
      name: "avatar",
      aliases: ["profilepic", "pic", "ava"],
      usage: "avatar [user mention/ID]",
      description:
        "Displays a user's avatar (or your own, if no user is mentioned).",
      type: client.types.INFO,
      examples: ["avatar @MDC"],
    });
  }
  async run(message, args) {
    const member =
      this.getMemberFromMention(message, args[0]) ||
      message.guild.members.cache.get(args[0]) ||
      message.member;
    const embed = new MessageEmbed()
      .setTitle(`${member.displayName}'s Avatar`)
      .setImage(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .addField(
        "Download Original Avatar",
        `[Click here](${member.user.displayAvatarURL({
          dynamic: true,
          size: 4096,
        })})`
      )
      .setTimestamp()
      .setColor(member.displayHexColor);

    let embed2;

    const customavatar = await message.client.utils.getMemberAvatar(
      member,
      message.guild,
      message.client
    );
    
    if (customavatar) {
      embed2 = new MessageEmbed();
      embed2.setURL("https://any-bot.tech");
      embed2.setImage(customavatar);

      embed.addField("Download Custom Avatar", `[Click here](${customavatar})`);
      embed.setURL("https://any-bot.tech");
    }

    if (embed2) {
      message.channel.send({ embeds: [embed, embed2] });
    } else {
      message.channel.send({ embeds: [embed] });
    }
  }
};
