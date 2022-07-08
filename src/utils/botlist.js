async function botlist(client){

    const path = require('path');

    const {AutoPoster} = require("topgg-autoposter");
    const {connectBdlBot} = require("bdl.js");
    const bldapikey = require(path.join(__dirname, '../../blapi.json'))
    const fetch = require('node-fetch');

    //Every 5 minutes, update the botlist
    setInterval(async () => {
        try {

            const details = {
                users: client.users.cache.size,
                guilds: client.guilds.cache.size
            };

            let formBody = [];

            for (const properly in details) {
                const encodedKey = encodeURIComponent(properly);
                const encodedValue = encodeURIComponent(details[properly]);
                formBody.push(encodedKey + ":" + encodedValue);
            }
            formBody = formBody.join("&");

            const postertopgg = AutoPoster(bldapikey.topgg, client);

            connectBdlBot(bldapikey.bdl, client).then(r => client.logger.info(r));

            postertopgg.on("posted", async (stats) => {
                client.logger.info("Post in Top.gg | " + stats.serverCount + " servers");
                await fetch(
                    "https://discordbotlist.com/api/v1/bots/733728002910715977/stats",
                    {
                        method: "POST",
                        headers: {
                            authorization: bldapikey.discordbotlist,
                            "content-type": "application/json"
                        },
                        body: JSON.stringify({
                            voice_connections: client.voiceConnections ? client.voiceConnections.size : 0,
                            guilds: client.guilds.cache.size,
                            users: client.users.cache.size,
                            shard_id: client.shard ? client.shard.id : 0,
                        })
                    }
                ).then(async (res) => {
                    client.logger.info("Post en DiscordBotList | " + res.status);
                });
            });

        } catch (error) {
            __Client.logger.error(error);
        }
    }, 300000);


}

module.exports.botlist = botlist;