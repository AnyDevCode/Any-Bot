module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isButton()) return;
    const button = interaction.client.buttons.get(interaction.customId);

    if (button.ownerOnly && !interaction.client.isOwner(interaction.user)) return;

    if (!button) return;

    try {
      await button.run(interaction);
    } catch (e) {
      interaction.client.emit("error", e);
    }
  },
};
