const Command = require("../Command.js");
const filters_list = [
  {
    name: "8D",
    usage: "eight-d",
  },
  {
    name: "3D",
    usage: "three-d",
  },
  {
    name: "Bassboost (low)",
    usage: "bassboost_low",
  },
  {
    name: "Bassboost",
    usage: "bassboost",
  },
  {
    name: "Bassboost (high)",
    usage: "bassboost_high",
  },
  {
    name: "Vaporwave",
    usage: "vaporwave",
  },
  {
    name: "Nightcore",
    usage: "nightcore",
  },
  {
    name: "Phaser",
    usage: "phaser",
  },
  {
    name: "Tremolo",
    usage: "tremolo",
  },
  {
    name: "Vibrato",
    usage: "vibrato",
  },
  {
    name: "Reverse",
    usage: "reverse",
  },
  {
    name: "Treble",
    usage: "treble",
  },
  {
    name: "Normalizer",
    usage: "normalizer",
  },
  {
    name: "Normalizer 2",
    usage: "normalizer2",
  },
  {
    name: "Surrounding",
    usage: "surrounding",
  },
  {
    name: "Pulsator",
    usage: "pulsator",
  },
  {
    name: "Subboost",
    usage: "subboost",
  },
  {
    name: "Karaoke",
    usage: "karaoke",
  },
  {
    name: "Flanger",
    usage: "flanger",
  },
  {
    name: "Gate",
    usage: "gate",
  },
  {
    name: "Haas",
    usage: "haas",
  },
  {
    name: "MCompand",
    usage: "mcompand",
  },
  {
    name: "Mono",
    usage: "mono",
  },
  {
    name: "MStlr",
    usage: "mstlr",
  },
  {
    name: "MStrr",
    usage: "mstrr", 
  },
  {
    name: "Compressor",
    usage: "compressor",
  },
  {
    name: "Expander",
    usage: "expander",
  },
  {
    name: "Softlimiter",
    usage: "softlimiter",
  },
  {
    name: "Chorus",
    usage: "chorus",
  },
  {
    name: "Chorus 2D",
    usage: "chorus2d",
  },
  {
    name: "Chorus 3D",
    usage: "chorus3d",
  },
  {
    name: "Fadein",
    usage: "fadein",
  },
  {
    name: "Dim",
    usage: "dim",
  },
  {
    name: "Earrape (Warning: May cause distortion)",
    usage: "earrape",
  }
];
const { MessageEmbed } = require("discord.js");

module.exports = class FiltersMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: "filters",
      usage: "filters",
      description: "Show all available filters",
      userPermissions: ["CONNECT", "SPEAK"],
      type: client.types.MUSIC,
    });
  }
  async run(message, args, client, player) {
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const embed = new MessageEmbed()
      .setTitle("Available Filters")
      .setDescription(
        `Use \`${prefix}filter [filter]\` to apply a filter to the music`
      )
      .setColor(message.guild.me.displayHexColor)
    for (const filter of filters_list) {
      embed.addField(filter.name, filter.usage);
    }
    message.reply({embeds: [embed]});
  }

}