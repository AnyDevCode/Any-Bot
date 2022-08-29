const Button = require("../Button.js");

module.exports = class EvalButton extends Button {
  constructor(client) {
    super(client, {
      name: "evalbtn",
      ownerOnly: true,
    });
  }

  async run(interaction) {
    //Delete the message
    await interaction.message.delete();
  }
};
