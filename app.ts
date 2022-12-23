if(process.env.NODE_ENV !== "production") require("dotenv").config();

import { Bot } from "./src/client";
import { GatewayIntentBits, Partials } from "discord.js";

// Create a new client instance
const client = new Bot({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution
    ],
    partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction, Partials.User],
    allowedMentions: { parse: ["users", "roles"], repliedUser: true }
});

function init() {
    client.loadLanguageFiles();
    client.loadAPIKeys();
    client.loadEvents("./src/events");
    client.loadCommands("./src/commands");
    client.loginBot();
}

init();

process.on("unhandledRejection", (err) => client.logger.error(err));