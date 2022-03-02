const SelectMenu = require("../SelectMenus.js");

module.exports = class HelpMenu extends SelectMenu {
    constructor(client) {
    super(client, {
        name: "help-menu"
    });
  }

  async run(interaction) {
      interaction.message.client.commands.get("help").run(interaction.message, ["-m",interaction.values[0]]);
      interaction.update({
          components: []
      });
      }
  };
