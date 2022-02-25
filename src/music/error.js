module.exports = {
  name: "error",
  async execute(queue, error) {
    console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
  },
};
