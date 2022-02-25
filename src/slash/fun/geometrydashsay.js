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
                .addChoice("Gatekeeper", "gatekeeper")
                .addChoice("Gatekeeper (Dark)", "gatekeeper.dark")
                .addChoice("KeyMaster", "keymaster")
                .addChoice("KeyMaster (Huh)", "keymaster.huh")
                .addChoice("KeyMaster (Scared)", "keymaster.scared")
                .addChoice("KeyMaster (Scream)", "keymaster.scream")
                .addChoice("Monster", "monster")
                .addChoice("Monster (Suprise)", "monster.eyes")
                .addChoice("Potbor", "potbor")
                .addChoice("Potbor (Annoyed)", "potbor.annoyed")
                .addChoice("Potbor (Huh)", "potbor.huh")
                .addChoice("Potbor (Mad)", "potbor.mad")
                .addChoice("Potbor (Right)", "potbor.right")
                .addChoice("Potbor (Talk)", "potbor.talk")
                .addChoice("Potbor (Tired)", "potbor.tired")
                .addChoice("Scratch", "scratch")
                .addChoice("Scratch (Annoyed)", "scratch.annoyed")
                .addChoice("Scratch (Huh)", "scratch.huh")
                .addChoice("Scratch (Mad)", "scratch.mad")
                .addChoice("Scratch (Right)", "scratch.right")
                .addChoice("Scratch (Talk)", "scratch.talk")
                .addChoice("Shopkeeper", "shopkeeper")
                .addChoice("Shopkeeper (Annoyed)", "shopkeeper.annoyed")
                .addChoice("Spooky", "spooky")
            )
            .addStringOption((option) =>
              option
                .setName("color")
                .setDescription("The color of the background")
                .setRequired(false)
                .addChoice("Blue", "blue")
                .addChoice("Green", "green")
                .addChoice("Orange", "orange")
                .addChoice("Pink", "pink")
                .addChoice("Purple", "purple")
                .addChoice("Red", "red")
                .addChoice("Brown", "brown")
                .addChoice("Aqua", "aqua")
                .addChoice("Grey", "grey")
            )
        ),
    });
  }

  async run(interaction) {
    const options = interaction.options;
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
