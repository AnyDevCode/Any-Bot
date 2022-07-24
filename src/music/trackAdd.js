module.exports = {
  name: "trackAdd",
  async execute(queue, track) {
    queue.metadata.channel.send(`🎶 | Track **${track.title}** queued!`);
  },
};
