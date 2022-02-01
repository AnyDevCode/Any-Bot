//Dependencies and const:
const {MessageEmbed} = require("discord.js");
// Command Require:
const Command = require("../Command.js");
const ReactionMenu = require('../ReactionMenu.js');
var fs = require("fs");

// Command Definition:
module.exports = class iavoiceCommand extends Command {
    constructor(client) {
        super(client, {
            name: "iavoices",
            aliases: ["iavs"],
            usage: "iavoices",
            description: "List of supported voices",
            type: client.types.FUN,
            examples: ["iavoices"],
        });
    }

    // Command Code:
    async run(message) {
        let voices = await fs.readFileSync(`./src/commands/fun/voices.txt`, "utf8");
        let voice_list = voices.split("\n");
        //Put 100 voices per page
        let pages = Math.ceil(voice_list.length / 25) + 1;
        let page = 1;
        let voice_list_page = voice_list.slice(0, 25);
        let voice_list_page_string = voice_list_page.join("\n");
        let n = 0;
        const embed = new MessageEmbed()
            .setTitle('🎤  Voice By IA  🎤')
            .setDescription("Welcome to the voice list.\n\n" + "Use the reactions below to navigate the list.\n\n" + "Use `iavoice [voice] [text]` to make a voice.")
            .setFooter(`Page ${page} of ${pages}`)
            .setFooter(
                'Expires after three minutes.\n' + message.member.displayName,
                message.author.displayAvatarURL({dynamic: true})
            )
            .setTimestamp()
            .setColor(message.guild.me.displayHexColor);
        const json = embed.toJSON();
        const previous = () => {
            n -= 25
            voice_list_page = voice_list.slice(n, n + 25);
            voice_list_page_string = voice_list_page.join("\n");
            page--;

            return new MessageEmbed(json)
                .setDescription(voice_list_page_string)
                .setFooter(`Page ${page} of ${pages}`)
        };
        const next = () => {
            n += 25;
            page++;
            voice_list_page = voice_list.slice(n, n + 25);
            voice_list_page_string = voice_list_page.join("\n");
            return new MessageEmbed(json)
                .setDescription(voice_list_page_string)
                .setFooter(`Page ${page} of ${pages}`)
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