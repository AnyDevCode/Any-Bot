module.exports = {
  name: "userUpdate",
  async execute(oldUser, newUser, commands, client) {
    if (
      oldUser.username !== newUser.username ||
      oldUser.discriminator !== newUser.discriminator
    ) {
      await client.mongodb.users.updateUser(
        newUser.username,
        newUser.discriminator,
        newUser.id
      );
      client.logger.info(`${oldUser.tag} user tag changed to ${newUser.tag}`);
    }
  },
};
