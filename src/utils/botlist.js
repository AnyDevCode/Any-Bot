async function botlist(client) {
  const path = require("path");

  const {
    AutoPoster
  } = require("topgg-autoposter");
  const {
    connectBdlBot
  } = require("bdl.js");
  const bldapikey = require(path.join(__dirname, "../../blapi.json"));
  const axios = require("axios");

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

      await axios.post(
        "https://discordbotlist.com/api/v1/bots/" + client.user.id + "/stats", {
          voice_connections: client.voiceConnections ?
            client.voiceConnections.size : 0,
          guilds: client.guilds.cache.size,
          users: client.users.cache.size,
          shard_id: client.shard ? client.shard.id : 0,
        }, {
          headers: {
            Authorization: bldapikey.discordbotlist,
            "content-type": "application/json",
          },
        }).then(async (res) => {
        client.logger.info("Post en DiscordBotList | " + res.status);
      }).catch((err) => {
        client.logger.error(err);
      });

      await axios.post("https://discords.com/bots/api/bot/" + client.user.id, {
          guilds: client.guilds.cache.size,
        }, {
          headers: {
            Authorization: bldapikey.discords,
            "Content-Type": "application/json",
          },
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
