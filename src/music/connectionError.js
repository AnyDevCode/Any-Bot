module.exports = {
  name: "connectionError",
  async execute(queue, error) {
    __Client.logger.error(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
  },
};
