//Dependencies and const:
const { MessageEmbed } = require("discord.js");
// Command Require:
const Command = require("../Command.js");
const ReactionMenu = require("../ReactionMenu.js");
const fs = require("fs");
const axios = require("axios");

//Make a petition to the API https://api.uberduck.ai/voices?mode=tts-all
//Get the voices and save them in a variable

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
    const voices = await axios
      .get("https://api.uberduck.ai/voices?mode=tts-all")
      .then(async (res) => {
        return (await res).data;
      });
    //Example of voice json:
    /*
        [
  {
    "architecture": "tacotron2",
    "category": "YouTubers",
    "controls": false,
    "display_name": "ContraPoints",
    "name": "contrapoints",
    "model_id": "b5beae12-eb8f-4f92-9569-55d03a300145",
    "memberships": [],
    "is_private": false,
    "contributors": [
      "santanalopez"
    ]
  },
      {
    "architecture": "tacotron2",
    "category": "The Elder Scrolls IV: Oblivion (Polish)",
    "controls": false,
    "display_name": "Argonianka (Polish)",
    "name": "argonianka",
    "model_id": "a71698d3-b3db-4ab3-90e2-9444d5934019",
    "memberships": [],
    "is_private": false,
    "contributors": [
      "MislausLasota",
      "patryk"
    ]
}
        ]
        */

    let new_voices = [];
    for (let i = 0; i < voices.length; i++) {
      //If the voice is not private and dont have memberships
      if (!voices[i].is_private && !voices[i].memberships.length) {
        new_voices.push(voices[i]);
      }
    }

    const new_list_voices = new_voices.map((voice) => {
      return `\`${voice.name}\` - ${voice.display_name}`;
    });

    //If the first argument is a -c, return the list of categories
    if (args[0] === "-c" && !args[1]) {
      let categories = [];
      for (let i = 0; i < new_voices.length; i++) {
        if (!categories.includes(new_voices[i].category)) {
          categories.push(new_voices[i].category);
        }
      }
      let categories_list = categories.map((category) => {
        return `\`${category}\``;
      });

      //Put 100 voices per page
      let pages = Math.ceil(categories_list.length / 25) + 1;
      let page = 0;
      let voice_list_page = categories_list.slice(0, 25);
      let voice_list_page_string = voice_list_page.join("\n");
      let n = -25;
      let prefix = await message.client.mongodb.settings.selectPrefix(message.guild.id);
      const embed = new MessageEmbed()
        .setTitle("🎤  Voice By IA  🎤")
        .setDescription(
          "Welcome to the voice list!\n\n" +
            "Use the reactions below to navigate the list.\n\n" +
            "If you want to see the list of voices of specific category, use the command `" +
            prefix +
            "aivoices -c <category>`\n\n" +
            "Use the emoji below to navigate the list."
        )
        .setFooter({
          text: "Expires after ten minutes.\n" + message.member.displayName,
          iconURL: message.author.displayAvatarURL(),
        })
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
        voice_list_page = categories_list.slice(n, n + 25);
        voice_list_page_string = voice_list_page.join("\n");
        embed.setDescription(voice_list_page_string);
        embed.setFooter({ text: `Page ${page} of ${pages}` });
      }
      const json = embed.toJSON();
      const previous = () => {
        n -= 25;
        voice_list_page = categories_list.slice(n, n + 25);
        voice_list_page_string = voice_list_page.join("\n");
        page--;

        if (page === 0) {
          return new MessageEmbed(json)
            .setDescription(
              "Welcome to the voice list.\n\n" +
                "Use the reactions below to navigate the list.\n\n" +
                `Use \`${prefix}aivoice [voice] [text]\` to make a voice.` +
                "\n\n" +
                "Use the emoji below to navigate the list."
            )
            .setFooter({ text: `Page ${page} of ${pages}` });
        }
        if (page < 0) {
          page = pages;
          n = (page - 1) * 25;
          voice_list_page = categories_list.slice(n, n + 25);
          voice_list_page_string = voice_list_page.join("\n");
          return new MessageEmbed(json).setFooter({
            text: `Page ${page} of ${pages}`,
          });
        }

        return new MessageEmbed(json)
          .setDescription(voice_list_page_string)
          .setFooter({ text: `Page ${page} of ${pages}` });
      };
      const next = () => {
        n += 25;
        page++;
        voice_list_page = categories_list.slice(n, n + 25);
        voice_list_page_string = voice_list_page.join("\n");
        if (page >= pages) {
          page = 0;
          n = -25;
          voice_list_page = categories_list.slice(n, n + 25);
          voice_list_page_string = voice_list_page.join("\n");
          return new MessageEmbed(json)
            .setDescription(
              "Welcome to the voice list.\n\n" +
                "Use the reactions below to navigate the list.\n\n" +
                `Use \`${prefix}aivoice [voice] [text]\` to make a voice.` +
                "\n\n" +
                "Use the emoji below to navigate the list."
            )
            .setFooter({ text: `Page ${page} of ${pages}` });
        }
        return new MessageEmbed(json)
          .setDescription(voice_list_page_string)
          .setFooter({ text: `Page ${page} of ${pages}` });
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
    } else if (args[0] === "-c" && args[1]) {
      //If the first argument is a -c, return the list of voices of the category in the second argument if it exists
      //The category variable is all args after the first
      let category = args.slice(1).join(" ");
      let category_voices = [];
      for (let i = 0; i < new_voices.length; i++) {

        if (new_voices[i].category == category) {
          category_voices.push(new_voices[i]);
        }
      }
      let category_voices_list = category_voices.map((voice) => {
        return `\`${voice.name}\` - ${voice.display_name}`;
      });

      //Check if the category exists
        if (category_voices_list.length === 0) {
            return message.channel.send(
                "The category you specified doesn't exist."
            );
        }

      //Check if category_voices_list has repeated voices
        let category_voices_list_unique = [];
        for (let i = 0; i < category_voices_list.length; i++) {
            if (!category_voices_list_unique.includes(category_voices_list[i])) {
                category_voices_list_unique.push(category_voices_list[i]);
            }
        }
        category_voices_list = category_voices_list_unique;

      let pages = Math.ceil(category_voices_list.length / 25) + 1;
      let page = 0;
      let voice_list_page = category_voices_list.slice(0, 25);
      let voice_list_page_string = voice_list_page.join("\n");
      let n = -25;
      let prefix = await message.client.mongodb.settings.selectPrefix(message.guild.id);

      const embed = new MessageEmbed()
        .setTitle("🎤  Voice By IA  🎤")
        .setDescription(
          "Welcome to the voice list!\n\n" +
            "Use the reactions below to navigate the list.\n\n" +
            "If you want to see the list of voices of specific category, use the command `" +
            prefix +
            "aivoices -c <category>`\n\n" +
            "Use the emoji below to navigate the list."
        )
        .setFooter({
          text: "Expires after ten minutes.\n" + message.member.displayName,
          iconURL: message.author.displayAvatarURL(),
        })
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
        voice_list_page = category_voices_list.slice(n, n + 25);
        voice_list_page_string = voice_list_page.join("\n");
        embed.setDescription(voice_list_page_string);
        embed.setFooter({ text: `Page ${page} of ${pages}` });
      }
      const json = embed.toJSON();
      const previous = () => {
        n -= 25;
        voice_list_page = category_voices_list.slice(n, n + 25);
        voice_list_page_string = voice_list_page.join("\n");
        page--;

        if (page === 0) {
          return new MessageEmbed(json)
            .setDescription(
              "Welcome to the voice list.\n\n" +
                "Use the reactions below to navigate the list.\n\n" +
                `Use \`${prefix}aivoice [voice] [text]\` to make a voice.` +
                "\n\n" +
                "Use the emoji below to navigate the list."
            )
            .setFooter({ text: `Page ${page} of ${pages}` });
        }
        if (page < 0) {
          page = pages;
          n = (page - 1) * 25;
          voice_list_page = category_voices_list.slice(n, n + 25);
          voice_list_page_string = voice_list_page.join("\n");
          return new MessageEmbed(json).setFooter({
            text: `Page ${page} of ${pages}`,
          });
        }

        return new MessageEmbed(json)
          .setDescription(voice_list_page_string)
          .setFooter({ text: `Page ${page} of ${pages}` });
      };
      const next = () => {
        n += 25;
        page++;
        voice_list_page = category_voices_list.slice(n, n + 25);
        voice_list_page_string = voice_list_page.join("\n");
        if (page >= pages) {
          page = 0;
          n = -25;
          voice_list_page = category_voices_list.slice(n, n + 25);
          voice_list_page_string = voice_list_page.join("\n");
          return new MessageEmbed(json)
            .setDescription(
              "Welcome to the voice list.\n\n" +
                "Use the reactions below to navigate the list.\n\n" +
                `Use \`${prefix}aivoice [voice] [text]\` to make a voice.` +
                "\n\n" +
                "Use the emoji below to navigate the list."
            )
            .setFooter({ text: `Page ${page} of ${pages}` });
        }
        return new MessageEmbed(json)
          .setDescription(voice_list_page_string)
          .setFooter({ text: `Page ${page} of ${pages}` });
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
    } else {
      //Put 100 voices per page
      let pages = Math.ceil(new_list_voices.length / 25) + 1;
      let page = 0;
      let voice_list_page = new_list_voices.slice(0, 25);
      let voice_list_page_string = voice_list_page.join("\n");
      let n = -25;
      let prefix = await message.client.mongodb.settings.selectPrefix(message.guild.id);
      const embed = new MessageEmbed()
        .setTitle("🎤  Voice By IA  🎤")
        .setDescription(
          "Welcome to the voice list.\n\n" +
            "Use the reactions below to navigate the list.\n\n" +
            "If you want to see the list of voices of specific category, use the command `" +
            prefix +
            "aivoices -c <category>`\n\n" +
            `Use \`${prefix}aivoice [voice] [text]\` to make a voice.` +
            "\n\n" +
            "Use the emoji below to navigate the list."
        )
        .setFooter({
          text: "Expires after ten minutes.\n" + message.member.displayName,
          iconURL: message.author.displayAvatarURL(),
        })
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
        voice_list_page = new_list_voices.slice(n, n + 25);
        voice_list_page_string = voice_list_page.join("\n");
        embed.setDescription(voice_list_page_string);
        embed.setFooter({ text: `Page ${page} of ${pages}` });
      }
      const json = embed.toJSON();
      const previous = () => {
        n -= 25;
        voice_list_page = new_list_voices.slice(n, n + 25);
        voice_list_page_string = voice_list_page.join("\n");
        page--;

        if (page === 0) {
          return new MessageEmbed(json)
            .setDescription(
              "Welcome to the voice list.\n\n" +
                "Use the reactions below to navigate the list.\n\n" +
                `Use \`${prefix}aivoice [voice] [text]\` to make a voice.` +
                "\n\n" +
                "Use the emoji below to navigate the list."
            )
            .setFooter({ text: `Page ${page} of ${pages}` });
        }
        if (page < 0) {
          page = pages;
          n = (page - 1) * 25;
          voice_list_page = new_list_voices.slice(n, n + 25);
          voice_list_page_string = voice_list_page.join("\n");
          return new MessageEmbed(json).setFooter({
            text: `Page ${page} of ${pages}`,
          });
        }

        return new MessageEmbed(json)
          .setDescription(voice_list_page_string)
          .setFooter({ text: `Page ${page} of ${pages}` });
      };
      const next = () => {
        n += 25;
        page++;
        voice_list_page = new_list_voices.slice(n, n + 25);
        voice_list_page_string = voice_list_page.join("\n");
        if (page >= pages) {
          page = 0;
          n = -25;
          voice_list_page = new_list_voices.slice(n, n + 25);
          voice_list_page_string = voice_list_page.join("\n");
          return new MessageEmbed(json)
            .setDescription(
              "Welcome to the voice list.\n\n" +
                "Use the reactions below to navigate the list.\n\n" +
                `Use \`${prefix}aivoice [voice] [text]\` to make a voice.` +
                "\n\n" +
                "Use the emoji below to navigate the list."
            )
            .setFooter({ text: `Page ${page} of ${pages}` });
        }
        return new MessageEmbed(json)
          .setDescription(voice_list_page_string)
          .setFooter({ text: `Page ${page} of ${pages}` });
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
