module.exports = {
    name: "channelEmpty",
    async execute(queue, track, player) {
      queue.metadata.channel.send("❌ | Nobody is in the voice channel, leaving...");
    },
  };
  