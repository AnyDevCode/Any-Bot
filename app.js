require("dotenv").config();
const Client = require("./src/client.js");
const config = require("./config.json");
const { Player } = require('discord-player');
const {index} = require("./src/utils/dashboard.js");
const botlist = config.botlist;
global.__basedir = __dirname;

const client = new Client(config, {
    intents: 8191,
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
});

client.player = new Player(client);
const player = client.player;

// Initialize client
function init() {
    client.loadCommands("./src/commands");
    client.loadSlashCommands("./src/slash")
    client.loadEvents("./src/events", client, player);
    client.loadMusicEvents("./src/music", player);
    client.loadTopics("./data/trivia");
    client.login(client.token);
}

init();

if (botlist) {
    let {botlist} = require("./src/utils/botlist.js")
    botlist(client).then(() => {
            client.logger.info("Botlist updated!");
        }
    );
}


if(!(client.shard)) {
    const { index } = require("./src/utils/dashboard.js");
    index(client);
}


process.on("unhandledRejection", (err) => client.logger.error(err));
