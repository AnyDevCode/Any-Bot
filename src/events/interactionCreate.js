module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isCommand) return;
    if (
      interaction.isContextMenu() ||
      interaction.isButton() ||
      interaction.isSelectMenu()
    )
      return;

    const command = interaction.client.slashes.get(interaction.commandName);

    if (!command) {
      return interaction.reply({
        content: "That command doesn't exist!",
        ephemeral: true,
      });
    }

    try {
      await command.run(interaction);
    } catch (e) {
      interaction.client.logger.error(e.stack);

      await interaction.reply({
        content: "An error occured while executing that command!",
        ephemeral: true,
      });
    }
  },
};
