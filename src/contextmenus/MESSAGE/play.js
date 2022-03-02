const ContextMenu = require("../ContextMenus.js");

module.exports = class PlaySongMessageContextMenu extends ContextMenu {
    constructor(client) {
    super(client, {
    name: "Play Song",
    data: {
        name: 'Play Song',
        type: 3,
    }
    });
  }

  async run(interaction, client, player) {
        await interaction.deferReply()

      interaction.member = interaction.user
      //Make a array
      let args = interaction.options._hoistedOptions[0].message.content.split(" ");

      //Run the command
      await interaction.client.commands.get("play").run(interaction.options._hoistedOptions[0].message, args, client, player)

      //Send a message
      return interaction.editReply("Ready to play!")
  }

};
