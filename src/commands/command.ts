import { Message, PermissionsBitField } from 'discord.js';
import { Bot } from '../client';
import { fail } from '../utils/emojis.json';
import { CommandTypes, CommandOptions } from '../utils/utils';
/**
 * Custom Command class
 */
export class Command {
    client: Bot;
    name: string;
    description: string | null = null;
    aliases: string[] | null;
    usage: string;
    cooldown: number = 0;
    type: CommandTypes = CommandTypes.Other;
    botPermissions: bigint[] = [];
    userPermissions: bigint[] = [];
    examples: string[] = [];
    ownerOnly: boolean = false;
    disabled: any = false;
    nsfw: boolean = false;
    premiumOnly: any;
    premiumCooldown: number = 0;
    /**
     * Create new command
     */
    constructor(client: Bot, options: CommandOptions) {
        
        /**
         * The client
         */
        this.client = client;
        /**
         * Name of the command
         */
        this.name = options.name;
        /**
         * Aliases of the command
         */
        this.aliases = options.aliases || null;
        /**
         * The arguments for the command
         */
        this.usage = options.usage || options.name;
        /**
         * The cooldown for the command
         */
        this.cooldown = options.cooldown || 0;
        /**
         * The type of command
         */
        this.type = options.type || CommandTypes.Other;
        /**
         * The client permissions needed
         */
        // this.clientPermissions = options.clientPermissions || ['SEND_MESSAGES', 'EMBED_LINKS'];
        this.botPermissions = options.botPermissions || [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks];
        /**
         * The user permissions needed
         */
        this.userPermissions = options.userPermissions || [];
        /**
         * Examples of how the command is used
         */
        this.examples = options.examples || [];
        /**
         * If command can only be used by owner
         */
        this.ownerOnly = options.ownerOnly || false;
        /**
         * If command is enabled
         */
        this.disabled = options.disabled || false;
        /**
         * If command can only be used in NSFW Channel
         */
        this.nsfw = options.nsfw || false;
        /**
         * If command can only be used by premium users
         */
        this.premiumOnly = options.premiumOnly || false;
        /**
         * The cooldown for premium users
         */
        this.premiumCooldown = options.premiumCooldown || 0;

    }
    /**
     * Runs the command
     */
    run(message: Message, args: string[], client: Bot, lang: string) {
        throw new Error(`The ${this.name} command has no run() method`);
    }
}