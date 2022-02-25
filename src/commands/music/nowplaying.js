const Command = require('../Command.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = class NowPlayingMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'nowplaying',
      usage: 'nowplaying',
      aliases: ['np', 'current'],
      description: 'Shows the song that is currently playing',
      type: client.types.MUSIC,
    });
  }
  async run(message, args, client, player) {

    const queue = player.getQueue(message.guild.id);
    if(!queue || !queue.playing) return message.reply(`❌ | There is nothing playing.`);

    const progress = queue.createProgressBar();
    const perc = queue.getPlayerTimestamp();

    const embed = new MessageEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setAuthor({
        name: `${message.guild.name} Music`,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setDescription(`🎶 | **${queue.current.title}**! (\`${perc.progress == 'Infinity' ? 'Live' : perc.progress + '%'}\`)`)
      .addField(
        "\u200b",
        progress.replace(/ 0:00/g, ' ◉ LIVE')
      )
      .setFooter({
        text: `${message.guild.name}`,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setTimestamp();

      const linkrow = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setLabel('Link')
        .setURL(queue.current.url)
        .setEmoji('🔗')
        .setStyle('LINK')
      );

      return message.reply({ embeds: [embed], components: [linkrow] });


    }
  };
