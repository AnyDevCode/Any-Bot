module.exports = {
    name: "channelEmpty",
    async execute(queue, track, player) {
      console.log("channelEmpty");
      queue.metadata.channel.send("❌ | Nobody is in the voice channel, leaving...");
    },
  };
  