async function botlist(client) {
  const path = require("path");

  const {
    AutoPoster
  } = require("topgg-autoposter");
  const {
    connectBdlBot
  } = require("bdl.js");
  const bldapikey = require(path.join(__dirname, "../../blapi.json"));
  const fetch = require("node-fetch");

  //Every 5 minutes, update the botlist
  try {
    const details = {
      users: client.users.cache.size,
      guilds: client.guilds.cache.size,
    };

    let formBody = [];

    for (const properly in details) {
      const encodedKey = encodeURIComponent(properly);
      const encodedValue = encodeURIComponent(details[properly]);
      formBody.push(encodedKey + ":" + encodedValue);
    }
    formBody = formBody.join("&");

    const postertopgg = AutoPoster(bldapikey.topgg, client);

    connectBdlBot(bldapikey.bdl, client).then((r) => client.logger.info(r));

    postertopgg.on("posted", async (stats) => {
      client.logger.info(
        "Post in Top.gg | " + stats.serverCount + " servers"
      );
      await fetch(
        "https://discordbotlist.com/api/v1/bots/" + client.user.id + "/stats", {
          method: "POST",
          headers: {
            Authorization: bldapikey.discordbotlist,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            voice_connections: client.voiceConnections ?
              client.voiceConnections.size :
              0,
            guilds: client.guilds.cache.size,
            users: client.users.cache.size,
            shard_id: client.shard ? client.shard.id : 0,
          }),
        }
      ).then(async (res) => {
        client.logger.info("Post en DiscordBotList | " + res.status);
      });

      await fetch("https://discords.com/bots/api/bot/" + client.user.id, {
          method: "POST",
          headers: {
            Authorization: bldapikey.discords,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            guilds: client.guilds.cache.size,
          }),
        })
        .then(async (res) => {
          client.logger.info("Post en Discords | " + res.status);
        })
        .catch((err) => {
          client.logger.error(err);
        });
    });
  } catch (error) {
    __Client.logger.error(error);
  }
}

module.exports.botlist = botlist;
