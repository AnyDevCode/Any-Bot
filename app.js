const config = require("./config.json");
const Client = require("./src/client.js");
const {Intents} = require("discord.js");
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
const client = new Client(config, {ws: {intents}});
// Initialize client
function init() {
    client.loadEvents("./src/events");
    client.loadCommands("./src/commands");
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

const { index } = require("./src/utils/dashboard.js");
index(client);

process.on("unhandledRejection", (err) => client.logger.error(err));
