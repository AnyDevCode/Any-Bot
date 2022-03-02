//Dependencies and const:
const {MessageEmbed} = require("discord.js");
// Command Require:
const Command = require("../Command.js");
const ReactionMenu = require('../ReactionMenu.js');
const fs = require("fs");

// Command Definition:
module.exports = class aivoiceCommand extends Command {
    constructor(client) {
        super(client, {
            name: "aivoices",
            aliases: ["aivs", "iavs", "iavoices"],
            usage: "aivoices <page>",
            description: "List of supported voices",
            type: client.types.FUN,
            examples: ["aivoices", "aivoices 2"],
        });
    }

    // Command Code:
    async run(message, args) {
        let voices = fs.readFileSync(__basedir + "/data/voices.txt", "utf8");
        let voice_list = voices.split("\n");
        //Put 100 voices per page
        let pages = Math.ceil(voice_list.length / 25) + 1;
        let page = 0;
        let voice_list_page = voice_list.slice(0, 25);
        let voice_list_page_string = voice_list_page.join("\n");
        let n = -25;
        let prefix = await message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
        const embed = new MessageEmbed()
            .setTitle('🎤  Voice By IA  🎤')
            .setDescription("Welcome to the voice list.\n\n" + "Use the reactions below to navigate the list.\n\n" + `Use \`${prefix}aivoice [voice] [text]\` to make a voice.` + "\n\n" + "Use the emoji below to navigate the list.")
            .setFooter(
                {text: 'Expires after ten minutes.\n' + message.member.displayName, iconURL: message.author.displayAvatarURL()}
            )
            .setTimestamp()
            .setColor(message.guild.me.displayHexColor);
        //If args, go to page:
        if (isNaN(args[0]) === false) {
            page = parseInt(args[0]);
            if (page > pages) {
                page = pages;
            }
            if (page < 1) {
                page = 1;
            }
            n = (page - 1) * 25;
            voice_list_page = voice_list.slice(n, n + 25);
            voice_list_page_string = voice_list_page.join("\n");
            embed.setDescription(voice_list_page_string);
            embed.setFooter({text: `Page ${page} of ${pages}`});
        }
        const json = embed.toJSON();
        const previous = () => {
            n -= 25
            voice_list_page = voice_list.slice(n, n + 25);
            voice_list_page_string = voice_list_page.join("\n");
            page--;

            if (page === 0) {
                return new MessageEmbed(json)
                    .setDescription("Welcome to the voice list.\n\n" + "Use the reactions below to navigate the list.\n\n" + `Use \`${prefix}aivoice [voice] [text]\` to make a voice.` + "\n\n" + "Use the emoji below to navigate the list.")
                    .setFooter({text: `Page ${page} of ${pages}`})
            }
            if (page < 0) {
                page = pages;
                n = (page - 1) * 25;
                voice_list_page = voice_list.slice(n, n + 25);
                voice_list_page_string = voice_list_page.join("\n");
                return new MessageEmbed(json)
                    .setFooter({text: `Page ${page} of ${pages}`})
            }

            return new MessageEmbed(json)
                .setDescription(voice_list_page_string)
                .setFooter({text: `Page ${page} of ${pages}`})
        };
        const next = () => {
            n += 25;
            page++;
            voice_list_page = voice_list.slice(n, n + 25);
            voice_list_page_string = voice_list_page.join("\n");
            if (page >= pages) {
                page = 0;
                n = -25;
                voice_list_page = voice_list.slice(n, n + 25);
                voice_list_page_string = voice_list_page.join("\n");
                return new MessageEmbed(json)
                    .setDescription("Welcome to the voice list.\n\n" + "Use the reactions below to navigate the list.\n\n" + `Use \`${prefix}aivoice [voice] [text]\` to make a voice.` + "\n\n" + "Use the emoji below to navigate the list.")
                    .setFooter({text: `Page ${page} of ${pages}`})
            }
            return new MessageEmbed(json)
                .setDescription(voice_list_page_string)
                .setFooter({text: `Page ${page} of ${pages}`})
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