module.exports = {
  name: "botDisconnect",
  async execute(queue, track, player) {
    console.log("botDisconnect");
    queue.metadata.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
  },
};
