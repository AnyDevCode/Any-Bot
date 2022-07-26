const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
const gis = require("g-i-s");
const Filter = require("bad-words");
const customFilter = new Filter({
  placeHolder: "#",
  replaceRegex: /[A-Za-z0-9가-힣_]/g,
});
customFilter.addWords(
  "NSFW",
  "nsfw",
  "r34",
  "R34",
  "rule34",
  "Rule34",
  "e621",
  "E621",
  "desnudos",
  "desnudas",
  "R-34",
  "rule 34"
);
const ReactionMenu = require("../ReactionMenu.js");

module.exports = class ImagesCommand extends Command {
  constructor(client) {
    super(client, {
      name: "images",
      usage: "images <search>",
      description: "Find an image in Google.",
      type: client.types.UTILS,
    });
  }
  async run(message, args) {
    const msg = await message.channel.send({ content: "Searching..." });

    let search = args.join(" ");
    if (!search) {
      return message.channel.send("Insert the you want to search first");
    }

    try {
      search = customFilter.clean(search);
    } catch (err) {
      search = search;
    }

    const options = {
      searchTerm: search,
      queryStringAddition: "&safe=active",
      filterOutDomains: [
        "google.com",
        "youtube.com",
        "giphy.com",
        "imgur.com",
        "facebook.com",
        "instagram.com",
        "pixabay.com",
        "pinterest.com",
        "deviantart.com",
      ],
    };

    gis(options, logResults);

    let allResults;

    function logResults(error, results) {
      if (error)
        return this.sendErrorMessage(
          message,
          1,
          "Please try again in a few seconds"
        );

      if (!results[0]) return msg.edit("No results found");

      let newresults = [];

      for (let i = 0; i < results.length; i++) {
        //Delete every url that is not an image in format png, jpg, jpeg, gif, check if end with png, jpg, jpeg, gif
        if (
          results[i].url.endsWith(".png") ||
          results[i].url.endsWith(".jpg") ||
          results[i].url.endsWith(".jpeg") ||
          results[i].url.endsWith(".gif")
        ) {
          newresults.push(results[i]);
        }
      }

      results = newresults;

      if (!results[0]) return msg.edit("No results found");

      allResults = results;

      msg.edit({
        content: "Found " + results.length + " results for " + search,
      });

      let i = 0;

      let max = allResults.length - 1;

      //First Embed
      const embed = new MessageEmbed()
        .setTitle("Result to your search")
        .setImage(allResults[i].url)
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor)
        .setFooter({
          text: `Page : ` + parseInt(i + 1) + `/` + parseInt(max + 1),
        });

      const json = embed.toJSON();

      const previous = () => {
        if (i > 0) {
          i--;
          return new MessageEmbed(json)
            .setTitle("Result to your search")
            .setImage(allResults[i].url)
            .setTimestamp()
            .setColor(message.guild.me.displayHexColor)
            .setFooter({
              text: `Page : ` + parseInt(i + 1) + `/` + parseInt(max + 1),
            });
        }
      };

      const next = () => {
        if (i < max - 1) {
          i++;
          return new MessageEmbed(json)
            .setTitle("Result to your search")
            .setImage(allResults[i].url)
            .setTimestamp()
            .setColor(message.guild.me.displayHexColor)
            .setFooter({
              text: `Page : ` + parseInt(i + 1) + `/` + parseInt(max + 1),
            });
        }
      };

      const reactions = {
        "◀️": previous,
        "⏹️": null,
        "▶️": next,
      };

      const menu = new ReactionMenu(
        message.client,
        message.channel,
        message.member,
        embed,
        null,
        null,
        reactions,
        600000
      );

      menu.reactions["⏹️"] = menu.stop.bind(menu);
    }
  }
};
