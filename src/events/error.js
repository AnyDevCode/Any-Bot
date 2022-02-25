module.exports = {
  name: "error",
  execute(info, commands, client) {
    client.logger.warn(info);
  },
};
