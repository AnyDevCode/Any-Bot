const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
const gis = require("g-i-s");
const Filter = require("bad-words");
const customFilter = new Filter({ placeHolder: "*" });

module.exports = class ImagesCommand extends Command {
  constructor(client) {
    super(client, {
      name: "images",
      usage: "images <search>",
      description: "Find an image in Google.",
      type: client.types.FUN,
    });
  }
  async run(message, args) {
    const msg = await message.channel.send({ content: "Searching..." });

    let search = args.join(" ");
    if (!search) {
      return message.channel.send("Insert the you want to search first");
    }

    search = customFilter.clean(search);

    const options = {
      searchTerm: search,
      queryStringAddition: "&safe=active",
      filterOutDomains: [
        "google.com",
        "youtube.com",
        "giphy.com",
        "imgur.com",
        "twitter.com",
        "facebook.com",
        "instagram.com",
        "pixabay.com",
        "pinterest.com",
        "deviantart.com",
      ],
    };

    gis(options, logResults);

    async function logResults(error, results) {
      if (!results[0]) {
        return msg.edit("No results found");
      }

      let newresults = []

      for (let i = 0; i < results.length; i++) {
        //Delete every url that is not an image in format png, jpg, jpeg, gif
        if (
          results[i].url.includes(".png") ||
          results[i].url.includes(".jpg") ||
          results[i].url.includes(".jpeg") ||
          results[i].url.includes(".gif")
        ) {
          newresults.push(results[i]);
        }
      }

      results = newresults;

      if (!results[0]) {
        return msg.edit("No results found");
      }

      if (error) {
        return await this.sendErrorMessage(
          message,
          1,
          "Please try again in a few seconds"
        );
      } else {
        let i = 0;

        let max = results.length - 1;

        const embed = new MessageEmbed()
          .setTitle("Result to your search")
          .setImage(results[i].url)
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor)
          .setFooter({
            text: `Page : ` + parseInt(i + 1) + `/` + parseInt(max + 1),
          });
        msg.edit({ embeds: [embed] }).then((msg) => {
          msg.react("◀️");
          msg.react("⏹️");
          msg.react("▶️");
          msg.awaitReactions((reaction, user) => {
            if (message.author.id !== user.id) {
              return;
            }
            if (reaction.emoji.name === "▶️") {
              if (i !== max) {
                i++;
                const embeds = new MessageEmbed()
                  .setTitle("Result to your search")
                  .setImage(results[i].url)
                  .setTimestamp()
                  .setColor(message.guild.me.displayHexColor)
                  .setFooter({
                    text: "Page : " + parseInt(i + 1) + "/" + parseInt(max + 1),
                  });
                msg.edit({ content: "Result to your search:", embeds: [embeds] });
              }
            }
            if (reaction.emoji.name === "⏹️") {
              msg.reactions.cache.get("◀️").remove();
              msg.reactions.cache.get("⏹️").remove();
              msg.reactions.cache.get("▶️").remove();
              const embedsss = new MessageEmbed()
                .setAuthor({
                  name: "Google Images",
                  iconURL:
                    "https://assets.stickpng.com/thumbs/5847f9cbcef1014c0b5e48c8.png",
                })
                .setDescription("Thanks for using Google Images")
                .setColor(message.guild.me.displayHexColor)
                .setTimestamp();
                msg.edit({ content: "Result to your search:", embeds: [embedsss] });
            }
            if (reaction.emoji.name === "◀️") {
              if (1 !== i) {
                i--;
                const embedss = new MessageEmbed()
                  .setTitle("Result to your search")
                  .setImage(results[i].url)
                  .setTimestamp()
                  .setColor(message.guild.me.displayHexColor)
                  .setFooter({
                    text: "Page : " + parseInt(i + 1) + "/" + parseInt(max + 1),
                  });
                  msg.edit({ content: "Result to your search:", embeds: [embedss] });
              }
            }
          });
        });
      }
    }
  }
};
