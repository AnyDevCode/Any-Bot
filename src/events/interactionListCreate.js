module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isSelectMenu()) return;
    interaction.message.author = interaction.user;
    const menu = interaction.client.menus.get(interaction.customId);
    if (!menu) return;
    try {
      await menu.run(interaction);
    } catch (e) {
      interaction.client.emit("error", e);
    }
  },
};
