module.exports = {
  name: "trackStart",
  async execute(queue, track, player) {
    queue.metadata.channel.send(`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
  },
};
