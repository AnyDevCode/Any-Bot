const { SlashCommandBuilder } = require("@discordjs/builders");
const Slash = require("../Slash.js");

module.exports = class EchoSlash extends Slash {
    constructor(client) {
    super(client, {
      name: "say",
      data: new SlashCommandBuilder()
        .setName("echo")
        .setDescription("Echo your message")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("The message to echo")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("ephemeral")
            .setDescription(
              "Whether the message should be sent as an ephemeral message"
            )
        ),
    });
  }

  async run(interaction) {
    const ephemeral = interaction.options.getBoolean("ephemeral");
    const message = interaction.options.getString("message");
    interaction.reply({
      content: message,
      ephemeral: ephemeral,
    });
  }
};
