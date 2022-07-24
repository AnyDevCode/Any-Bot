module.exports = {
  name: "tracksAdd",
  async execute(queue, tracks) {
    queue.metadata.channel.send(`🎶 | **${tracks.length}** tracks queued!`);
  },
};
