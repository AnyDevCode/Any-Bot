const { ShardingManager } = require("discord.js");

const config = require("./config.json");
const shardManager = new ShardingManager(`${__dirname}/app.js`, {
  token: config.token,
});

shardManager.spawn("auto");
shardManager.on("shardCreate", (shard) =>
  __Client.logger.info(`Shard ${shard.id} launched`)
);
