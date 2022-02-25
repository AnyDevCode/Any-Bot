// Dependencies:
const {MessageEmbed} = require("discord.js");
const {
    searchAmazon,
} = require("unofficial-amazon-search");
const ReactionMenu = require('../ReactionMenu.js');
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

        // Article:
        let article = args.join(" ");

        // If no article:
        if (!article) {
            return message.channel.send({content: 
                "Insert the product you want to search first"
            });
        }

        // Search:
        let i = 0;

        //Fucntion obtains the results from the Amazon API
        async function search(article) {
            let results = [];

            await searchAmazon(article).then(res => {
                // If no results:
                if (!res.searchResults.length) {
                    return message.channel.send({
                        content: "No results found"
                    });
                }

                // If there are results, put them in an array:
                // Loop through the results:
                for (let integrer = 0; integrer < res.searchResults.length; integrer++) {
                    // Put the results in an array:
                    results.push(res.searchResults[integrer]);
                }


            });

            return results;
        }

        // Res let:
        const response = await search(article);

        //Max results:
        let max = response.length;


        // First Embed:
        const embed = new MessageEmbed()
                .setAuthor({name: "Amazon", icon_url: "https://clipartcraft.com/images/amazon-logo-transparent-circle.png"})
                .setTitle(`Results for ${article} (Link)`)
                .setURL("https://amazon.com" + response[0].productUrl)
                .setDescription(`**Name:** \n**${response[0].title}**\n\n**Stars:** \n**${response[0].rating.score}/${response[0].rating.outOf}**`)
                .setFooter({
                    text: "Page 1 of " + max,
                })
                .setColor(message.guild.me.displayHexColor)
                .setImage(response[0].imageUrl)


        const json = embed.toJSON();

        const previous = () => {
            if (i > 0) {
                i--;
                return new MessageEmbed(json)
                .setTitle(`Results for ${article} (Link)`)
                    .setURL("https://amazon.com" + response[i].productUrl)
                    .setDescription(`**Name:** \n**${response[i].title}**\n\n**Stars:** \n**${response[i].rating.score}/${response[i].rating.outOf}**`)
                    .setFooter({
                        text: "Page " + (i + 1) + " of " + max,
                    })
                    .setColor(message.guild.me.displayHexColor)
                    .setTimestamp()
                    .setFooter(
                        {text: "Page " + (i + 1) + " of " + max, icon_url: message.author.displayAvatarURL({ dynamic: true })}
                    )
                    .setImage(response[i].imageUrl)
        };
    }

        const next = () => {
            if (i < max - 1) {
                i++;
                const embed = new MessageEmbed(json)
                .setTitle(`Results for ${article} (Link)`)
                    .setURL("https://amazon.com" + response[i].productUrl)
                    .setDescription(`**Name:** \n**${response[i].title}**\n\n**Stars:** \n**${response[i].rating.score}/${response[i].rating.outOf}**`)                    
                    .setFooter({
                        text: "Page " + (i + 1) + " of " + max,
                    })
                    .setColor(message.guild.me.displayHexColor)
                    .setTimestamp()
                    .setFooter(
                        {text: "Page " + (i + 1) + " of " + max, icon_url: message.author.displayAvatarURL({ dynamic: true })}
                    )
                    .setImage(response[i].imageUrl)

                    return embed

            };
        };

        const reactions = {
            '◀️': previous,
            '⏹️': null,
            '▶️': next,
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

        menu.reactions['⏹️'] = menu.stop.bind(menu);
        }
    };