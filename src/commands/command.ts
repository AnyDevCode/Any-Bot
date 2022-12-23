import { EmbedBuilder, Message, User, PermissionsBitField } from 'discord.js';
import permissions from '../utils/permissions.json';
import { Bot } from '../client';
import { fail } from '../utils/emojis.json';
import { CommandTypes, CommandsErrorTypes, CommandOptions } from '../utils/utils';
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

    }
    /**
     * Runs the command
     */
    run(message: Message, args: string[], client: Bot, lang: string) {
        throw new Error(`The ${this.name} command has no run() method`);
    }
    /**
     * Helper method to check permissions
     */
    checkPermissions(message: Message, ownerOverride = true) {
        if (message.channel.isDMBased()) return false;
        if (!message?.guild?.members.me) return false;
        if (!message.channel.permissionsFor(message.guild?.members.me).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks])) return false;
        const clientPermission = this.checkClientPermissions(message);
        const userPermission = this.checkUserPermissions(message, ownerOverride);
        if (clientPermission && userPermission) return true;
        else return false;
    }
    /**
     * Checks the user permissions
     * Code modified from: https://github.com/discordjs/Commando/blob/master/src/commands/base.js
     * @param {Message} message
     * @param {boolean} ownerOverride
     */
    checkUserPermissions(message: Message, ownerOverride = true) {
        if (message.channel.isDMBased()) return false;
        if (!this.ownerOnly && !this.userPermissions) return true;
        if (ownerOverride && this.client.isOwner(message.author)) return true;
        if (this.ownerOnly && !this.client.isOwner(message.author)) {
            return false;
        }
        if (message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) return true;
        if (this.userPermissions) {
            const missingPermissions =
                message.channel?.permissionsFor(message.author)?.missing(this.userPermissions).map(p => permissions[p]);
            if (missingPermissions?.length !== 0 && typeof missingPermissions !== 'undefined') {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `${message.author.tag}`,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setTitle(`${fail} Missing User Permissions: \`${this.name}\``)
                    .setDescription(`\`\`\`diff\n${missingPermissions.map(p => `- ${p}`).join('\n')}\`\`\``)
                    .setTimestamp()
                    .setColor(message.guild?.members?.me?.displayHexColor || message.author.hexAccentColor || 'Random')
                message.channel.send({
                    embeds: [embed]
                });
                return false;
            }
        }
        return true;
    }
    /**
     * Checks the client permissions
     */
    checkClientPermissions(message: Message) {
        if (message.channel.isDMBased()) return false;
        if (!message?.guild?.members?.me) return false;
        const missingPermissions =
            message.channel.permissionsFor(message.guild.members.me).missing(this.botPermissions).map(p => permissions[p]);
        if (missingPermissions.length !== 0) {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL()
                })
                .setTitle(`${fail} Missing Bot Permissions: \`${this.name}\``)
                .setDescription(`\`\`\`diff\n${missingPermissions.map(p => `- ${p}`).join('\n')}\`\`\``)
                .setTimestamp()
                .setColor(message.guild.members.me.displayHexColor || message.author.hexAccentColor || 'Random')
            message.channel.send({
                embeds: [embed]
            });
            return false;
        } else return true;
    }
    /**
     * Creates and sends command failure embed
     */
    async sendErrorMessage(message: Message, errorType: CommandsErrorTypes, reason:string, errorMessage = null) {
        // const prefix = await message.client.mongodb.settings.selectPrefix(message?.guild?.members.me?.id);
        const prefix = "!"
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${message.author.username}`,
                iconURL: message.author.displayAvatarURL()
            })
            .setTitle(`${fail} Error: \`${this.name}\``)
            .setDescription(`\`\`\`diff\n- ${errorType}\n+ ${reason}\`\`\``)
            .addFields({
                name: 'Usage',
                value: `\`${prefix}${this.usage}\``
            })
            .setTimestamp()
            .setColor(message?.guild?.members.me?.displayHexColor || message.author.hexAccentColor || 'Random')
        if(this.examples ) embed.addFields({
            name: 'Examples',
            value: this.examples.map(e => `\`${prefix}${e}\``).join('\n')
        })
        if (errorMessage) embed.addFields({
            name: 'Error Message',
            value: `\`\`\`${errorMessage}\`\`\``
        });
        message.channel.send({
            embeds: [embed]
        })
    }
    /**
     * Creates and sends mod log embed
     */
    async sendModLogMessage(message:Message, reason:string, fields: {name: string, value: string}[] = []) {
        // const modLogId = await message.client.mongodb.settings.selectModLogId(message.guild.id);
        const modLogId = "123"
        const modLog = message.guild?.channels.cache.get(modLogId);
        if(!modLog?.isTextBased()) return
        if(!message.guild?.members?.me) return
        if (
            modLog &&
            modLog.viewable &&
            modLog.permissionsFor(message.guild?.members?.me).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks])
        ) {
            // const caseNumber = await message.client.utils.getCaseNumber(message.client, message.guild, modLog);
            const caseNumber = 1
            const embed = new EmbedBuilder()
                .setTitle(`Action: \`${this.client.utils.Capitalize(this.name)}\``)
                .addFields({
                    name: 'Moderator',
                    value: `${message.member}`,
                    inline: true
                })
                .setFooter({
                    text: `Case #${caseNumber}`
                })
                .setTimestamp()
                .setColor(message.guild?.members.me.displayHexColor || message.author.hexAccentColor || 'Random');
            for (const field in fields) {
                embed.addFields({
                    name: `${fields[field].name}`,
                    value: `${fields[field].value}`,
                    inline: true
                })
            }
            embed.addFields({
                name: 'Reason',
                value: `${reason}`
            })
            modLog.send({
                embeds: [embed]
            }).catch(err => this.client.logger.error(err.stack));
        }
    }

}