module.exports = {
  name: "under_construction",
  run: async () => {
    const {Client} = require("discord.js");
    global.__basedir = __dirname;

    const client = new Client({
      intents: 8191,
      allowedMentions: { parse: ["users", "roles"], repliedUser: true },
    });

    client.once("ready", () => {
      //Change the bot's status dnd
      client.user.setPresence(
            {
                activities: [
                    {
                        name: "Under Construction",
                        type: 'LISTENING'
                    }
                ],
                status: "dnd"
            }
        ) 
    });

    await client.login(process.env.TOKEN);
  },
};
