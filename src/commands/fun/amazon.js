const Command = require("../Command.js");
const { MessageEmbed } = require("discord.js");
const {
  searchAmazon,
  AmazonSearchResult,
} = require("unofficial-amazon-search");

module.exports = class AmazonCommand extends Command {
  constructor(client) {
    super(client, {
      name: "amazon",
      usage: "amazon <article>",
      description: "Find an Amazon Product.",
      type: client.types.FUN,
    });
  }
  async run(message, args) {
    let article = args.join(" ");
    if (!article) {
      return message.channel.send(
        "Insert the product you want to search first"
      );
    }
    var i = 0;
    searchAmazon(article)
      .then((res) => {
        let max = res.searchResults.length - 1;
        const embed = new MessageEmbed()
          .setTitle(res.searchResults[i].title)
          .setURL("https://amazon.com" + res.searchResults[i].productUrl)
          .addField("Name:", res.searchResults[i].title)
          .addField(
            "Stars:",
            res.searchResults[i].rating.score +
              "/" +
              res.searchResults[i].rating.outOf,
            true
          );
        if (typeof res.searchResults[i].prices[0] == "undefined") {
          embed.addField("Price:", "Free", true);
        } else {
          embed.addField(
            "Price:",
            `$ ${res.searchResults[i].prices[0].price}`,
            true
          );
          if (typeof res.searchResults[i].prices[0].label == "object") {
            embed.addField("For:", "Physical Object or Digital Object", true);
          } else {
            embed.addField("For:", res.searchResults[i].prices[0].label, true);
          }
        }
        embed
          .setImage(res.searchResults[i].imageUrl)
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor)
          .setFooter(`Page : ` + parseInt(i + 1) + `/` + parseInt(max + 1))
          .setThumbnail("https://i.imgur.com/4gVj6Xf.png");
        message.channel.send(embed).then((msg) => {
          msg.react("◀️");
          msg.react("⏹️");
          msg.react("▶️");
          msg.awaitReactions((reaction, user) => {
            if (message.author.id != user.id) {
              return;
            }
            if (reaction.emoji.name === "▶️") {
              if (i != max) {
                i++;
                const embeds = new MessageEmbed()
                  .setTitle(res.searchResults[i].title)
                  .setURL(
                    "https://amazon.com" + res.searchResults[i].productUrl
                  )
                  .addField("Name:", res.searchResults[i].title)
                  .addField(
                    "Stars:",
                    res.searchResults[i].rating.score +
                      "/" +
                      res.searchResults[i].rating.outOf,
                    true
                  );
                if (typeof res.searchResults[i].prices[0] == "undefined") {
                  embeds.addField("Price:", "Free", true);
                } else {
                  embeds.addField(
                    "Price:",
                    `$ ${res.searchResults[i].prices[0].price}`,
                    true
                  );
                  if (typeof res.searchResults[i].prices[0].label == "object") {
                    embeds.addField(
                      "For:",
                      "Physical Object or Digital Object",
                      true
                    );
                  } else {
                    embeds.addField(
                      "For:",
                      res.searchResults[i].prices[0].label,
                      true
                    );
                  }
                }
                embeds
                  .setImage(res.searchResults[i].imageUrl)
                  .setTimestamp()
                  .setColor(message.guild.me.displayHexColor)
                  .setFooter(
                    `Page : ` + parseInt(i + 1) + `/` + parseInt(max + 1)
                  )
                  .setThumbnail("https://i.imgur.com/4gVj6Xf.png");
                msg.edit(embeds);
              }
            }
            if (reaction.emoji.name === "⏹️") {
              msg.reactions.cache.get("◀️").remove();
              msg.reactions.cache.get("⏹️").remove();
              msg.reactions.cache.get("▶️").remove();
              const embedsss = new MessageEmbed()
                .setTitle("Amazon")
                .setImage("https://i.imgur.com/4gVj6Xf.png")
                .setFooter(
                  `Page : ` + parseInt(i + 1) + `/` + parseInt(max + 1)
                )
                .setTimestamp();
              msg.edit(embedsss);
            }
            if (reaction.emoji.name === "◀️") {
              if (1 != i) {
                i--;
                const embedss = new MessageEmbed()
                  .setTitle(res.searchResults[i].title)
                  .setURL(
                    "https://amazon.com" + res.searchResults[i].productUrl
                  )
                  .addField("Name:", res.searchResults[i].title)
                  .addField(
                    "Stars:",
                    res.searchResults[i].rating.score +
                      "/" +
                      res.searchResults[i].rating.outOf,
                    true
                  );

                if (typeof res.searchResults[i].prices[0] == "undefined") {
                  embedss.addField("Price:", "Free", true);
                } else {
                  embedss.addField(
                    "Price:",
                    `$ ${res.searchResults[i].prices[0].price}`,
                    true
                  );
                  if (typeof res.searchResults[i].prices[0].label == "object") {
                    embedss.addField(
                      "For:",
                      "Physical Object or Digital Object",
                      true
                    );
                  } else {
                    embedss.addField(
                      "For:",
                      res.searchResults[i].prices[0].label,
                      true
                    );
                  }
                }
                embedss
                  .setImage(res.searchResults[i].imageUrl)
                  .setTimestamp()
                  .setColor(message.guild.me.displayHexColor)
                  .setFooter(
                    `Page : ` + parseInt(i + 1) + `/` + parseInt(max + 1)
                  )
                  .setThumbnail("https://i.imgur.com/4gVj6Xf.png");
                msg.edit(embedss);
              }
            }
          });
        });
      })
      .catch((error) => {
        message.channel.send("Sorry, I didn't find the product, try again");
        return console.log(error);
      });
  }
};
