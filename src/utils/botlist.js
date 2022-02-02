async function botlist(client){

    const path = require('path');

    const {AutoPoster} = require("topgg-autoposter");
    const {connectBdlBot} = require("bdl.js");
    const bldapikey = require(path.join(__dirname, '../../blapi.json'))

    //Every 5 minutes, update the botlist
    setInterval(async () => {
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

        } catch (error) {
            console.log(error);
        }
    }, 300000);


}

module.exports.botlist = botlist;