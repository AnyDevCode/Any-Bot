module.exports = {
  name: "botDisconnect",
  async execute(queue, track, player) {
    queue.metadata.channel.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
  },
};
