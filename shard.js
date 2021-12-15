const { AutoPoster } = require("topgg-autoposter")

const { connectBdlBot } = require("bdl.js");
const bldapikey = require("./blapi.json");

const { ShardingManager } = require('discord.js');

global.__basedir = __dirname;

const config = require('./config.json')
const shardManager = new ShardingManager(`${__dirname}/app.js`, { token: config.token });
const Client = require("./src/client.js");
const client = new Client(config);

var details = {
  users: client.users.cache.size,
  guilds: client.guilds.cache.size,
};

var formBody = [];

for (var properly in details) {
  var encodedKey = encodeURIComponent(properly);
  var encodedValue = encodeURIComponent(details[properly]);
  formBody.push(encodedKey + ":" + encodedValue);
}
formBody = formBody.join("&");

const postertopgg = AutoPoster(bldapikey.topgg, client);

connectBdlBot(bldapikey.bdl, client);

postertopgg.on("posted", async (stats) => {
  console.log("Posteado en Top.gg | " + stats.serverCount + " servers");
  await fetch(
    "https://discordbotlist.com/api/v1/bots/733728002910715977/stats",
    {
      method: "POST",
      headers: {
        authorization: bldapikey.discordbotlist,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    }
  ).then(async (res) => {
    await res.json()
  });
});


shardManager.spawn('auto');
shardManager.on('shardCreate', shard => console.log(`Shard ${shard.id} launched`));
