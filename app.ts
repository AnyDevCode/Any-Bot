if (process.env.NODE_ENV !== "production") require('dotenv').config();

import { Bot } from "./src/client";
import { GatewayIntentBits, Partials, Options, PermissionFlagsBits, GuildScheduledEventStatus } from "discord.js";

// Create a new client instance
const client: Bot = new Bot({
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
    allowedMentions: { parse: ["users", "roles"], repliedUser: true },
    makeCache: Options.cacheWithLimits({
        ...Options.DefaultMakeCacheSettings,
        AutoModerationRuleManager: {
            maxSize: 10
        },
        ApplicationCommandManager: {
            maxSize: 100,
        },
        BaseGuildEmojiManager: {
            maxSize: Infinity,
        },
        GuildEmojiManager: {
            maxSize: Infinity
        },
        GuildMemberManager: {
            maxSize: 250,
            keepOverLimit: member => member.user.bot || member.permissions.has([PermissionFlagsBits.Administrator]) || member.permissions.has([PermissionFlagsBits.ManageGuild]) || (member.user.id === client.user?.id)
        },
        GuildBanManager: {
            maxSize: 25,
        },
        GuildForumThreadManager: {
            maxSize: 25,
            keepOverLimit: thread => thread.archived === false || thread.locked === false || thread.ownerId === client.user?.id
        },
        GuildInviteManager: {
            maxSize: 10,
            keepOverLimit: invite => invite.inviter?.id === client.user?.id
        },
        GuildScheduledEventManager: {
            maxSize: 5,
            keepOverLimit: event => event.status === GuildScheduledEventStatus.Scheduled || event.status === GuildScheduledEventStatus.Active
        },
        GuildStickerManager: {
            maxSize: Infinity
        },
        GuildTextThreadManager: {
            maxSize: 25,
            keepOverLimit: thread => thread.archived === false || thread.locked === false || thread.ownerId === client.user?.id
        },
        PresenceManager: {
            maxSize: 0,
        },
        ReactionManager: {
            maxSize: 50,
            keepOverLimit: reaction => reaction.users.cache.has(client.user?.id as string)
        },
        ReactionUserManager: {
            maxSize: 25,
            keepOverLimit: user => user.id === client.user?.id
        },
        StageInstanceManager: {
            maxSize: 5,
            keepOverLimit: instance => instance.channel?.members.has(client.user?.id as string) || false
        },
        ThreadManager: {
            maxSize: 25,
            keepOverLimit: thread => thread.archived === false || thread.locked === false || thread.ownerId === client.user?.id
        },
        ThreadMemberManager: {
            maxSize: 25,
            keepOverLimit: member => member.id === client.user?.id
        },
        UserManager: {
            maxSize: 500,
            keepOverLimit: user => user.bot || user.id === client.user?.id
        },
        VoiceStateManager: {
            maxSize: 100,
            keepOverLimit: state => state.member?.permissions.has([PermissionFlagsBits.Administrator]) || state.member?.permissions.has([PermissionFlagsBits.ManageGuild]) || state.member?.user.bot || state.member?.user.id === client.user?.id
        },
    }),
    sweepers: {
        ...Options.DefaultSweeperSettings,
        messages: {
            interval: 60 * 60 * 24 * 7, // Every 7 days
            lifetime: 60 * 60 * 24 * 7, // Remove messages older than 7 days.
        },
        users: {
            interval: 60 * 60, // Every hour
            filter: () => (user) => user.bot && user.id !== client.user?.id, // Remove all bots.
        },
        applicationCommands: {
            interval: 60 * 60, // Every hour
            filter: () => (command) => command.guildId === null && command.applicationId === client.user?.id, // Remove all global commands that are not the bot's.
        },
        bans: {
            interval: 60 * 60 * 24, // Every day
            filter: () => (ban) => ban.guild.members.me?.permissions.has([PermissionFlagsBits.BanMembers]) || false, // Remove all bans that the bot can't unban.
        },
        emojis: {
            interval: 60 * 60 * 24, // Every day
            filter: () => (emoji) => !emoji.available // Remove all unavailable emojis.
        },
        invites: {
            interval: 60 * 60, // Every hour
            filter: () => (invite) => (invite.uses === invite.maxUses && invite.maxUses !== 0) || (invite.expiresTimestamp && invite.expiresTimestamp < Date.now()) || false, // Remove all invites that are expired, have reached their max uses.
        },
        guildMembers: {
            interval: 60 * 60, // Every hour
            filter: () => (member) => member.user.bot && member.user.id !== client.user?.id // Remove all bots.
        },
        stickers: {
            interval: 60 * 60 * 24, // Every hour
            filter: () => (sticker) => !sticker.available // Remove all unavailable stickers.
        },
        threadMembers: {
            interval: 60 * 60, // Every hour
            filter: () => (member) => (member.user?.bot as boolean && member.user?.id as string !== client.user?.id as string) || false // Remove all bots.
        },
        threads: {
            interval: 60 * 60 * 24, // Every day
            filter: () => (thread) => thread.archived === true || thread.locked === true // Remove all archived or locked threads.
        },
    },
});

function init() {
    client.loadEmojis("./src/utils/emojis.json");
    client.loadLanguageFiles();
    client.loadAPIKeys();
    client.loadEvents("./src/events");
    client.loadCommands("./src/commands");
    client.loadTopics("./data/trivia");
    client.loginBot();
}

init();

process.on("unhandledRejection", (err) => client.logger.error(err));