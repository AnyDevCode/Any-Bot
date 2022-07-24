const ContextMenu = require('../ContextMenus.js')

module.exports = class PlaySongMessageContextMenu extends ContextMenu {
  constructor(client) {
    super(client, {
      name: 'Play Song',
      data: {
        name: 'Play Song',
        type: 3,
      },
    })
  }

  async run(interaction, client, player) {
    // Defer the response
    await interaction.deferReply()

    // Change the interaction member to the interaction author
    interaction.member = interaction.user

    //Make a array of content of the message
    let args = interaction.options._hoistedOptions[0].message.content.split(' ')

    //Get the message
    let message = interaction.options._hoistedOptions[0].message

    //Change the message author to the interaction author
    message.author = interaction.user

    //Run the command
    await interaction.client.commands
      .get('play')
      .run(message, args, client, player)

    //Send a message
    return interaction.editReply('Ready to play!')
  }
}
