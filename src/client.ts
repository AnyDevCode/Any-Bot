import { Client, ClientOptions, Collection, User } from "discord.js";
import { logger } from "./utils/logger";
import { readdirSync } from "fs";
import { resolve } from "path";
// @ts-ignore
import AsciiTable from "ascii-table";
import Utils from "./utils/utils";
import MondoDB from "./utils/mongodb";
import {Command} from "./commands/command";

//Make a class that extends the Client class
class Bot extends Client {
    /**
     * Bot ID
     */
    id: string | undefined = process.env.BOTID;

    /**
     * Bot token
     */
    bot_token: string | undefined = process.env.TOKEN;

    /**
     * Bot prefix
     */
    prefix: string = process.env.PREFIX || ">";

    /**
     * Commands Collection
     */
    commands: Collection<string, Command> = new Collection();

    /**
     * Aliases Collection
     */
    aliases: Collection<string, string> = new Collection();

    /**
     * Cooldowns Collection
     */
    cooldowns: Collection<string, Map<string, number>> = new Collection();

    /**
     * Events Collection
     */
    events: Collection<string, Function> = new Collection();

    /**
     * Slash Commands Collection
     */
    slashCommands: Collection<unknown, unknown> = new Collection();

    /**
     * Buttons Collection
     */
    buttons: Collection<unknown, unknown> = new Collection();

    /**
     * Select Menus Collection
     */
    selectMenus: Collection<unknown, unknown> = new Collection();

    /**
     * Modals Collection
     */
    modals: Collection<unknown, unknown> = new Collection();

    /**
     * API Keys Collection
     */
    apiKeys: Collection<string, string> = new Collection();

    /**
     * Language Collection
     */
    language: Collection<string, Map<string, any>> = new Collection();

    /**
     * API URL
     */
    apiURL: string = process.env.APIURL || "http://localhost:3000";

    /**
     * CDN URL
     */
    cdnURL: string = process.env.CDNURL || "http://localhost:3000/cdn";

    /**
     * Owner ID
     */
    ownerID: string | undefined = process.env.OWNERID;

    /**
     * Developers IDs
     */
    developersIDs: string[] = process.env.DEVELOPERSIDS?.split(",") || [];

    /**
     * Bug Report Channel ID
     */
    bugReportChannelID: string | undefined = process.env.BUGREPORTCHANNELID;

    /**
     * Feedback Channel ID
     */
    feedbackChannelID: string | undefined = process.env.FEEDBACKCHANNELID;

    /**
     * Server Log ID
     */
    serverLogID: string | undefined = process.env.SERVERLOGID;

    /**
     * Support Server Invite
     */
    supportServerInvite: string | undefined = process.env.SUPPORTSERVERLINK;

    /**
     * Bot Version
     */
    version: string = require("../package.json").version;

    /**
     * Logger for the bot
     */
    logger: any = logger;

    /**
     * Utils for the bot
     */
    utils = Utils;

    /**
     * Database for the bot
     */
    database = MondoDB;

    /**
    * Function to login the bot
    */
    loginBot: () => void;

    /**
     * Function to load events
     */
    loadEvents: (path: string) => void;

    /**
     * Function to load commands
     */
    loadCommands: (path: string) => void;

    /**
     * Function to get if the owner of the bot is the author of the message
     */
    isOwner: (author: User) => boolean;
    loadAPIKeys: () => void;
    loadLanguageFiles: () => void;

    /**
   * Create a new client
   */
    constructor(options: ClientOptions) {
        super(options);

        this.logger.info("Initializing...");

        /**
         * Login the bot to discord
         */
        this.loginBot = function () {
            this.login(this.bot_token)
        }

        /**
         * Load API Keys
         */
        this.loadAPIKeys = function () {
            this.logger.info("Loading API Keys...");
            //With fs read the env file and get the api keys, the api keys are like
            //APIKEY_CATAPI=token
            //APIKEY_CATAPI2=token
    
            //Get the api keys
            let apiKeys = Object.keys(process.env).filter((key) => key.startsWith("APIKEY_"));
            let apiTable = new AsciiTable("API Keys");
    
            //Add the api keys to the collection
            apiKeys.forEach((key) => {
                apiTable.setHeading("Key", "Status");
                apiTable.addRow(key.replace("APIKEY_", ""), "✅");
                this.apiKeys.set(key.replace("APIKEY_", ""), process.env[key] || "");
            });
    
            console.log(apiTable.toString());
    
            this.logger.info(this.apiKeys.size + " API Keys loaded!");
        }

        /**
         * Load Language Files
         */
        this.loadLanguageFiles = function () {
            this.logger.info("Loading language files...");
            let table = new AsciiTable("Language Files");
            table.setHeading("File", "Language", "Status");
            readdirSync(resolve(__dirname, "../data/language")).forEach((languageDir) => {
                readdirSync(resolve(__dirname, "../data/language", languageDir)).forEach((TypeDir) => {
                    readdirSync(resolve(__dirname, "../data/language", languageDir, TypeDir)).forEach((file) => {
                        let pull = require(resolve(__dirname, "../data/language", languageDir, TypeDir, file));
                        if (!pull) table.addRow(file, languageDir, "❌");
                        else {
                            if (!this.language.has(languageDir)) this.language.set(languageDir, new Map());
                            this.language.get(languageDir)?.set(file.replace(".json", ""), pull);
                            table.addRow(file, languageDir, "✅");
                        }
                    });
                });
            });
            console.log(table.toString());
            this.logger.info(this.language.size + " Language Files loaded!");
        }

        /**
         * Load events
         */
        this.loadEvents = function (path: string) {
            this.logger.info("Loading events...");
            let table = new AsciiTable("Events");
            table.setHeading("Event", "Status");
            readdirSync(path).forEach((file) => {
                let pull = require(resolve(path, file));
                if (!pull.name) table.addRow(file, "❌");
                else {
                    this.events.set(pull.name, pull);
                    if (!pull.once) this.on(pull.name, (...args: any) => pull.run(...args, this));
                    else this.once(pull.name, (...args: any) => pull.run(...args, this));
                    table.addRow(file, "✅");
                    this.events.set(pull.name, pull);
                }
            });
            console.log(table.toString());

            this.logger.info(this.events.size + " events loaded!");
        }

        /**
         * Load commands
         */
        this.loadCommands = function (path: string) {
            this.logger.info("Loading commands...");
            let table = new AsciiTable("Commands");
            table.setHeading("Command", "Aliases", "Status");
            readdirSync(path).forEach((dir) => {
                //Check if dir is a directory
                if (!dir.endsWith(".js") && !dir.endsWith(".ts")) {
                    readdirSync(resolve(path, dir)).forEach((file) => {
                        let pull = require(resolve(path, dir, file));
                        if (!pull.name) table.addRow(file, "", "❌");
                        else {
                            this.commands.set(pull.name, pull);
                            if (pull.aliases) pull.aliases.forEach((alias: string) => {
                                //Check if alias exists
                                if (this.aliases.has(alias)) this.logger.warn("Alias " + alias + " already exists!");
                                else this.aliases.set(alias, pull.name);
                            });
                            table.addRow(file, pull.aliases || "None", "✅");
                        }
                    });
                }
            });
            
            console.log(table.toString());

            this.logger.info(this.commands.size + " commands loaded!");
        }

        /**
         * Check if the owner of the bot is the author of the message
         */
        this.isOwner = function (author: User) {
            if(author.id === this.ownerID) return true;
            if(this.developersIDs.includes(author.id)) return true;
            return false;
        }

    }
}

export { Bot };
