module.exports = {
  name: "queueEnd",
  async execute(queue) {
    queue.metadata.channel.send("✅ | Queue finished!");
  },
};
