const Modal = require("../Modal.js");

module.exports = class EchoModal extends Modal {
  constructor(client) {
    super(client, {
      name: "echo",
    });
  }

  async run(interaction) {
    const firstResponse = interaction.getTextInputValue("text-echo");
    interaction.reply({ content: firstResponse });
  }
};
