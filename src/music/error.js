module.exports = {
  name: "error",
  async execute(queue, error) {
    __Client.logger.error(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
  },
};
