module.exports = {
    name: "interactionCreate",
    async execute (interaction, Slashes, Commands, Client, Player) {
        if(!interaction.isContextMenu()) return;
        const command = interaction.client.slashes.get(interaction.commandName);

        if(!command) {

            return interaction.reply({
                content: "That command doesn't exist!",
                ephemeral: true
            })}

        try {
            await command.run(interaction, Client, Player);
        } catch(e) {
            if(e) console.log(e);

            await interaction.reply({
                content: "An error occured while executing that command!",
                ephemeral: true
            })
        }
    }
}
