const { SlashCommandBuilder } = require("@discordjs/builders");
const Slash = require("../Slash.js");
const { Modal, TextInputComponent, showModal } = require("discord-modals");

module.exports = class EchoSlash extends Slash {
  constructor(client) {
    super(client, {
      name: "say",
      data: new SlashCommandBuilder()
        .setName("echo")
        .setDescription("Echo your message"),
    });
  }

  async run(interaction) {
    const modal = new Modal() // We create a Modal
      .setCustomId("echo")
      .setTitle("Please enter your message")
      .addComponents(
        new TextInputComponent() // We create a Text Input Component
          .setCustomId("text-echo")
          .setLabel("message")
          .setStyle("LONG")
          .setMinLength(1)
          .setMaxLength(1024)
          .setPlaceholder("Enter your message")
          .setRequired(true) // If it's required or not
      );

    await showModal(modal, {
      client: interaction.client, // This method needs the Client to show the Modal through the Discord API.
      interaction: interaction, // This method needs the Interaction to show the Modal with the Interaction ID & Token.
    });
  }
};
