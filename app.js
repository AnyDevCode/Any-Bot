const config = require("./config.json");
const Client = require("./src/client.js");
const { Intents } = require("discord.js");

const botlist = config.botlist;
global.__basedir = __dirname;

// Client setup
const intents = new Intents();
intents.add(
  "GUILD_PRESENCES",
  "GUILD_MEMBERS",
  "GUILDS",
  "GUILD_VOICE_STATES",
  "GUILD_MESSAGES",
  "GUILD_MESSAGE_REACTIONS"
);
const client = new Client(config, { ws: { intents: intents } });

if (botlist) {
  const { AutoPoster } = require("topgg-autoposter");
  const { connectBdlBot } = require("bdl.js");
  const bldapikey = require("./blapi.json");

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

  connectBdlBot(bldapikey.bdl, client).then(r => console.log(r));

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
      await res.json();
    });
  });
}

// Initialize client
function init() {
  client.loadEvents("./src/events");
  client.loadCommands("./src/commands");
  client.loadTopics("./data/trivia");
  client.login(client.token);
}

init();
process.on("unhandledRejection", (err) => client.logger.error(err));
