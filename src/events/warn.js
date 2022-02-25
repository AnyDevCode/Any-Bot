module.exports = {
  name: "warn",
  execute(info, commands, client) {
    client.logger.warn(info);
  },
};
