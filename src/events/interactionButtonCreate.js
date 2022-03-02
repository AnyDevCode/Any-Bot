module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (!interaction.isButton()) return;
        const button = interaction.client.buttons.get(interaction.customId);

        if (button.ownerOnly && (interaction.user.id !== interaction.client.ownerID)) return;

        if (!button) return;


        try {
            await button.run(interaction);
        } catch (e) {
            if (e) console.log(e);

            interaction.client.emit("error", e);
        }
    },
};
