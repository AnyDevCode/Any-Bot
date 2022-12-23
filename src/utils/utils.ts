import { Message } from 'discord.js';
import { Bot } from "../client";

function Capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

//Interface with Types for Commands, like "Utils", "Fun", "Moderation", etc.
enum CommandTypes {
    Utils = "Utils",
    Fun = "Fun",
    Moderation = "Moderation",
    Owner = "Owner",
    Economy = "Economy",
    Games = "Games",
    NSFW = "NSFW",
    Image = "Image",
    Utility = "Utility",
    Info = "Info",
    Config = "Config",
    Bot = "Bot",
    Other = "Other",
    Giveaway = "Giveaway",
    Ticket = "Ticket",
    Leveling = "Leveling",
    Discord = "Discord",
    Anime = "Anime",
    Roleplay = "Roleplay",
    Animals = "Animals",
}

enum CommandsErrorTypes {
    InvalidArgument = 'Invalid Argument',
    CommandFailure = 'Command Failure',
    NotNSFW = 'This is not a NSFW channel',
    MissingPermissions = 'Missing Permissions',
}

interface CommandOptions {
    name: string;
    description?: string;
    aliases?: string[] | null;
    usage?: string;
    cooldown?: number;
    type?: CommandTypes;
    botPermissions?: bigint[];
    userPermissions?: bigint[];
    examples?: string[];
    ownerOnly?: boolean;
    disabled?: any;
    nsfw?: boolean;
    run: (message: Message, args: string[], client: Bot, lang: string) => Promise<void | Message>;
}
export default { CommandTypes, CommandsErrorTypes, Capitalize }
export { CommandTypes, CommandsErrorTypes, CommandOptions, Capitalize }