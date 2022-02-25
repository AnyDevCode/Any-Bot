module.exports = {
  name: "queueEnd",
  async execute(queue, track, player) {
    queue.metadata.channel.send("✅ | Queue finished!");
  },
};
