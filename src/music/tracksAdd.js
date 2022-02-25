module.exports = {
  name: "tracksAdd",
  async execute(queue, tracks, player) {
    queue.metadata.channel.send(`🎶 | **${tracks.length}** tracks queued!`);
  },
};
