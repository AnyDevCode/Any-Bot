module.exports = {
  name: "trackAdd",
  async execute(queue, track, player) {
    queue.metadata.channel.send(`🎶 | Track **${track.title}** queued!`);
  },
};
