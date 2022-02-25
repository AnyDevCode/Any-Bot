const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const { mem, cpu, os } = require("node-os-utils");
const { stripIndent } = require("common-tags");

module.exports = class StatsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "stats",
      aliases: ["statistics", "metrics"],
      usage: "stats",
      description: "Fetches Any Bot's statistics.",
      type: client.types.INFO,
    });
  }
  async run(message) {
    const d = moment.duration(message.client.uptime);
    const days = d.days() == 1 ? `${d.days()} day` : `${d.days()} days`;
    const hours = d.hours() == 1 ? `${d.hours()} hour` : `${d.hours()} hours`;
    const clientStats = stripIndent`
      Servers   :: ${message.client.guilds.cache.size}
      Users     :: ${message.client.users.cache.size}
      Channels  :: ${message.client.channels.cache.size}
      WS Ping   :: ${Math.round(message.client.ws.ping)}ms
      Uptime    :: ${days} and ${hours}
    `;
    const { totalMemMb, usedMemMb } = await mem.info();
    var osname = await os.oos();
    if (osname == "not supported") osname = "Unknown";
    const serverStats = stripIndent`
      OS        :: ${osname}
      CPU       :: ${cpu.model()}
      Cores     :: ${cpu.count()}
      CPU Usage :: ${await cpu.usage()} %
      RAM       :: ${(totalMemMb / 1024).toFixed(2)} GB
      RAM Usage :: ${(usedMemMb / 1024).toFixed(2)} GB 
    `;
    const embed = new MessageEmbed()
      .setTitle(`${message.client.user.username}'s Statistics`)
      .addField(
        "Commands",
        `\`${message.client.commands.size}\` commands`,
        true
      )
      .addField("Aliases", `\`${message.client.aliases.size}\` aliases`, true)
      .addField(
        "Command Types",
        `\`${Object.keys(message.client.types).length}\` command types`,
        true
      )
      .addField("Client", `\`\`\`asciidoc\n${clientStats}\`\`\``)
      .addField("Server", `\`\`\`asciidoc\n${serverStats}\`\`\``)
      .addField('Links',
          `**[Invite Me](https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot%20applications.commands&permissions=8) | ` +
        `[Support Server](${message.client.supportServerInvite})**`
      )
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({embeds:[embed]});
  }
};
