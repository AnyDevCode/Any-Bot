module.exports = {
    name: "channelEmpty",
    async execute(queue) {
      queue.metadata.channel.send("❌ | Nobody is in the voice channel, leaving...");
    },
  };
  