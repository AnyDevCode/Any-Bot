const { SlashCommandBuilder } = require("@discordjs/builders");
const Slash = require("../Slash.js");
const { MessageAttachment } = require("discord.js");

module.exports = class GeometryDashSaySlash extends Slash {
  constructor(client) {
    super(client, {
      name: "geometrydashsay",
      data: new SlashCommandBuilder()
        .setName("geometrydashsay")
        .setDescription("Say something in Geometry Dash")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("monster")
            .setDescription("Make a monster message in Geometry Dash")
            .addStringOption((option) =>
              option
                .setName("text")
                .setDescription("The text of the monster message")
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("monster")
                .setDescription("The name of the monster")
                .setRequired(false)
                .addChoices(
                  { name: "Gatekeeper", value: "gatekeeper" },
                  { name: "Gatekeeper (Dark)", value: "gatekeeper.dark" },
                  { name: "KeyMaster", value: "keymaster" },
                  { name: "KeyMaster (Huh)", value: "keymaster.huh" },
                  { name: "KeyMaster (Scared)", value: "keymaster.scared" },
                  { name: "KeyMaster (Scream)", value: "keymaster.scream" },
                  { name: "Monster", value: "monster" },
                  { name: "Monster (Suprise)", value: "monster.eyes" },
                  { name: "Potbor", value: "potbor" },
                  { name: "Potbor (Annoyed)", value: "potbor.annoyed" },
                  { name: "Potbor (Huh)", value: "potbor.huh" },
                  { name: "Potbor (Mad)", value: "potbor.mad" },
                  { name: "Potbor (Right)", value: "potbor.right" },
                  { name: "Potbor (Talk)", value: "potbor.talk" },
                  { name: "Potbor (Tired)", value: "potbor.tired" },
                  { name: "Scratch", value: "scratch" },
                  { name: "Scratch (Annoyed)", value: "scratch.annoyed" },
                  { name: "Scratch (Huh)", value: "scratch.huh" },
                  { name: "Scratch (Mad)", value: "scratch.mad" },
                  { name: "Scratch (Right)", value: "scratch.right" },
                  { name: "Scratch (Talk)", value: "scratch.talk" },
                  { name: "Shopkeeper", value: "shopkeeper" },
                  { name: "Shopkeeper (Annoyed)", value: "shopkeeper.annoyed" },
                  { name: "Spooky", value: "spooky" }
                )
            )
            .addStringOption((option) =>
              option
                .setName("color")
                .setDescription("The color of the background")
                .setRequired(false)
                .addChoices(
                  { name: "Blue", value: "blue" },
                  { name: "Green", value: "green" },
                  { name: "Orange", value: "orange" },
                  { name: "Pink", value: "pink" },
                  { name: "Purple", value: "purple" },
                  { name: "Red", value: "red" },
                  { name: "Brown", value: "brown" },
                  { name: "Aqua", value: "aqua" },
                  { name: "Grey", value: "grey" }
                )
            )
        ),
    });
  }

  async run(interaction) {
    const options = interaction.options;
    console.log(options);
    const type_message = options._subcommand;
    const { stringToUrlEncoded } = interaction.client.utils;

    await interaction.deferReply();

    switch (type_message) {
      case "monster": {
        let monster = options.getString("monster") || "Gatekeeper";
        let text = options.getString("text");
        let color = options.getString("color") || "blue";
        let username = options.getString("user") || interaction.user.username;

        text = stringToUrlEncoded(text);
        username = stringToUrlEncoded(username);

        let link = `https://gdcolon.com/tools/gdtextbox/img/${text}?color=${color}&name=${username}&char=${monster}`;

        let attachment = new MessageAttachment(link, "comment.png");

        return interaction.editReply({ files: [attachment] });
      }
    }
  }
};
