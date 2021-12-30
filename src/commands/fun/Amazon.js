// Dependencies:
const {MessageEmbed} = require("discord.js");
const {
    searchAmazon,
} = require("unofficial-amazon-search");
// Command Require:
const Command = require("../Command.js");

// Command Definition:
module.exports = class AmazonCommand extends Command {
    constructor(client) {
        super(client, {
            name: "amazon",
            usage: "amazon <article>",
            description: "Find an Amazon Product.",
            type: client.types.FUN,
        });
    }

    // Command Code:
    async run(message, args) {

        // Embed Function:
        function AmazonEmbed(i, res) {
            return new MessageEmbed()
                .setAuthor("Amazon", "https://clipartcraft.com/images/amazon-logo-transparent-circle.png")
                .setTitle(`Results for ${article}`)
                .setURL("https://amazon.com" + res.searchResults[i].productUrl)
                .addField("Name:", res.searchResults[i].title)
                .addField(
                    "Stars:",
                    res.searchResults[i].rating.score +
                    "/" +
                    res.searchResults[i].rating.outOf,
                    true
                );
        }

        // Article:
        let article = args.join(" ");

        // If no article:
        if (!article) {
            return message.channel.send(
                "Insert the product you want to search first"
            );
        }

        // Search:
        let i = 0;
        searchAmazon(article)
            .then((res) => {
                // All Results:
                let max = res.searchResults.length - 1;
                // First Result:
                const First_Embed = AmazonEmbed(i, res);
                // If no price:
                if (typeof res.searchResults[i].prices[0] == "undefined") {
                    First_Embed.addField("Price:", "Free", true);
                } else {
                    // If priced:
                    First_Embed.addField(
                        "Price:",
                        `$ ${res.searchResults[i].prices[0].price}`,
                        true
                    );
                    // If not defined type:
                    if (typeof res.searchResults[i].prices[0].label == "object") {
                        First_Embed.addField("For:", "Physical Object or Digital Object", true);
                    } else {
                        // If defined type:
                        First_Embed.addField("For:", res.searchResults[i].prices[0].label, true);
                    }
                }
                // Add decoration to embed:
                First_Embed
                    .setImage(res.searchResults[i].imageUrl)
                    .setTimestamp()
                    .setColor(message.guild.me.displayHexColor)
                    .setFooter(`Page : ` + parseInt(i + 1) + `/` + parseInt(max + 1))
                // Send First Embed and await for reaction:
                message.channel.send(First_Embed).then((msg) => {
                    // Reaction Filter:
                    msg.react("◀️");
                    msg.react("⏹️");
                    msg.react("▶️");
                    msg.awaitReactions((reaction, user) => {
                        // Check if user reacted is the same as the author:
                        if (message.author.id !== user.id) {
                            return;
                        }
                        // Check if reaction is arrow to go:
                        if (reaction.emoji.name === "▶️") {
                            // If not last page:
                            if (i !== max) {
                                // Increment i:
                                i++;
                                // New Embed:
                                const Next_Embed = AmazonEmbed(i, res)
                                // If no price:
                                if (typeof res.searchResults[i].prices[0] == "undefined") {
                                    Next_Embed.addField("Price:", "Free", true);
                                } else {
                                    // If priced:
                                    Next_Embed.addField(
                                        "Price:",
                                        `$ ${res.searchResults[i].prices[0].price}`,
                                        true
                                    );
                                    // If not defined type:
                                    if (typeof res.searchResults[i].prices[0].label == "object") {
                                        Next_Embed.addField(
                                            "For:",
                                            "Physical Object or Digital Object",
                                            true
                                        );
                                    } else {
                                        // If defined type:
                                        Next_Embed.addField(
                                            "For:",
                                            res.searchResults[i].prices[0].label,
                                            true
                                        );
                                    }
                                }
                                // Add decoration to embed:
                                Next_Embed
                                    .setImage(res.searchResults[i].imageUrl)
                                    .setTimestamp()
                                    .setColor(message.guild.me.displayHexColor)
                                    .setFooter(
                                        `Page : ` + parseInt(i + 1) + `/` + parseInt(max + 1)
                                    );
                                // Edit message:
                                msg.edit(Next_Embed);
                            }
                        }
                        // Check if reaction is stop:
                        if (reaction.emoji.name === "⏹️") {
                            // Delete reaction:
                            msg.reactions.cache.get("◀️").remove();
                            msg.reactions.cache.get("⏹️").remove();
                            msg.reactions.cache.get("▶️").remove();
                            // Create a Goodbye Embed:
                            const Finish_Embed = new MessageEmbed()
                                .setAuthor("Amazon", "https://clipartcraft.com/images/amazon-logo-transparent-circle.png")
                                .setDescription("Thanks for using the Amazon")
                                .setColor(message.guild.me.displayHexColor)
                                .setTimestamp();
                            // Edit embed to Goodbye embed:
                            msg.edit(Finish_Embed);
                        }
                        // Check if reaction is arrow to go back:
                        if (reaction.emoji.name === "◀️") {
                            // If not first page:
                            if (1 !== i) {
                                // Decrement i:
                                i--;
                                // New Embed:
                                const Previous_Embed = AmazonEmbed(i, res)
                                // If no price:
                                if (typeof res.searchResults[i].prices[0] == "undefined") {
                                    Previous_Embed.addField("Price:", "Free", true);
                                } else {
                                    // If priced:
                                    Previous_Embed.addField(
                                        "Price:",
                                        `$ ${res.searchResults[i].prices[0].price}`,
                                        true
                                    );
                                    // If not defined type:
                                    if (typeof res.searchResults[i].prices[0].label == "object") {
                                        Previous_Embed.addField(
                                            "For:",
                                            "Physical Object or Digital Object",
                                            true
                                        );
                                    } else {
                                        // If defined type:
                                        Previous_Embed.addField(
                                            "For:",
                                            res.searchResults[i].prices[0].label,
                                            true
                                        );
                                    }
                                }
                                // Add decoration to embed:
                                Previous_Embed
                                    .setImage(res.searchResults[i].imageUrl)
                                    .setTimestamp()
                                    .setColor(message.guild.me.displayHexColor)
                                    .setFooter(
                                        `Page : ` + parseInt(i + 1) + `/` + parseInt(max + 1)
                                    )
                                // Edit message:
                                msg.edit(Previous_Embed);
                            }
                        }
                    });
                });
            })
            // If error:
            .catch(() => {
                // Send error message:
                message.channel.send("Sorry, I didn't find the product, try again");
            });
    }
};
