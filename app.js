require("dotenv").config();
const Client = require("./src/client.js");
const config = require("./config.json");
const { Player } = require('discord-player');
const botlist = config.botlist;
const discordModals = require('discord-modals')
global.__basedir = __dirname;

const client = new Client(config, {
    partials: ["CHANNEL"],
    intents: 130815,
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
});

discordModals(client);

client.player = new Player(client);
const player = client.player;

// Initialize client
function init() {
    client.loadCommands("./src/commands");
    client.loadSlashCommands("./src/slash")
    client.loadButtons("./src/buttons");
    client.loadSelectMenus("./src/selectmenus");
    client.loadContextMenus("./src/contextmenus");
    client.loadModals("./src/modals");
    client.loadEvents("./src/events", client, player);
    client.loadMusicEvents("./src/music", player);
    client.loadTopics("./data/trivia");
    client.login(client.token)
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
    index(client).then(() => {
        client.logger.info("Dashboard initialized!");
    });
}


process.on("unhandledRejection", (err) => client.logger.error(err));
