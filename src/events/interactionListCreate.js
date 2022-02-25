const fetch = require("node-fetch");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const wait = require("util").promisify(setTimeout);
module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isSelectMenu()) return;
    if(interaction.customId == "help-menu") {
      interaction.message.client.commands.get("help").run(interaction.message, ["-m",interaction.values[0]]);
      interaction.update({
        components: []
      });
    }
  },
};
