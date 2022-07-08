module.exports = {
  name: "guildUpdate",
  async execute(oldGuild, newGuild, commands, client) {
  
    if (oldGuild.name === newGuild.name) return;
  
    // Update DB with new name
    await client.mongodb.settings.updateGuildName(newGuild.name, oldGuild.id);
    await client.mongodb.users.updateGuildName(newGuild.name, oldGuild.id);
    await client.mongodb.warns.updateGuildName(newGuild.name, oldGuild.id);
  
    client.logger.info(`${oldGuild.name} server name changed to ${newGuild.name}`);
  

  },
};
