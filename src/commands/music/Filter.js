const Command = require("../Command.js");
const { AudioFilters } = require("discord-player");

const filters_list = [
  "eight-d",
  "three-d",
  "bassboost_low",
  "bassboost",
  "bassboost_high",
  "vaporwave",
  "nightcore",
  "phaser",
  "tremolo",
  "vibrato",
  "reverse",
  "treble",
  "normalizer",
  "normalizer2",
  "surrounding",
  "pulsator",
  "subboost",
  "karaoke",
  "flanger",
  "gate",
  "haas",
  "mcompand",
  "mono",
  "mstlr",
  "mstrr",
  "compressor",
  "expander",
  "softlimiter",
  "chorus",
  "chorus2d",
  "chorus3d",
  "fadein",
  "dim",
  "earrape"
];

module.exports = class FilterMusicCommand extends Command {
  constructor(client) {
    super(client, {
      name: "filter",
      usage: "filter [filter]",
      aliases: ["f"],
      description: "Put filters and effects on the music",
      examples: [
        "filter bass",
        "filter 3d",
      ],
      userPermissions: ["CONNECT", "SPEAK"],
      type: client.types.MUSIC,
    });
  }
  async run(message, args, client, player) {
    AudioFilters.define("eight-d", "apulsator=hz=0.09");
    AudioFilters.define("three-d", "apulsator=hz=0.128");

    const queue = player.queues.get(message.guild.id);

    if(!queue) return message.reply("❌ | There is no music playing")

    const filters = queue._activeFilters;
    let Filters = filters

    if(!args[0]) return Filters.length ? message.reply(`🎶 | The current filters are: ${Filters.join(", ")}`) : message.reply("🎶 | There are no filters active");

    const filter = args[0].toLowerCase();

    if(!filters_list.includes(filter)) return message.reply(`❌ | The filter ${filter} does not exist`)

    if(filters.includes(filter)) {
      let newFilters = {};

      //Filters show a object how this {'0': 'vaporwave'}, transform it to {'vaporwave': true}
      Filters.forEach(filter => {
        newFilters[filter] = true;
      })

      newFilters[filter] = false;

      queue.setFilters(newFilters);
      return message.reply(`❌ | Removed filter ${filter}`)
    } else {
      //Add filter
      let newFilters = {};

      //Filters show a object, example: {'0': 'vaporwave'}, transform it to {'vaporwave': true}
      Filters.forEach(filter => {
        newFilters[filter] = true;
      })

      //Insert the new filter to Filters object, example: {'vaporwave': true, 'bassboost': true} 
      newFilters[filter] = true;

      queue.setFilters(newFilters)
      return message.reply(`🎶 | Added filter ${filter}`)
    }

  }

}