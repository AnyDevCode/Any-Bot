import { CommandTypes, CommandOptions, CommandsErrorTypes } from '../../utils/utils';
import { PermissionFlagsBits } from 'discord.js';

let command: CommandOptions = {
    name: 'say',
    usage: 'say [channel id/mention] <text>',
    type: CommandTypes.Fun,
    examples: ['say #general Hello World!', 'say 1234567890 Hello World!', 'say Hello World!'],
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("say") || client.language.get("en")?.get("say");

        if(message.channel.isDMBased()) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.guildOnly);

        // Check if channel is provided
        let channel = client.utils.getChannelFromMention(message, args[0]) || message.guild?.channels.cache.get(args[0]);
        if (channel) args.shift();
        else channel = message.channel; // If no channel is provided, use the current channel.


        // Check type and viewable
        if (!channel.isTextBased() || !channel.guild || !channel.viewable) {
            return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.InvalidArgument, lang.errors.invalidChannel);
        }

        if (!message.guild) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.guildOnly);

        // Get mod channels
        let modChannelIds: string[] = await client.database.settings.selectModChannelIds(message.guild?.id) || [];
        if (modChannelIds.includes(channel.id)) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.InvalidArgument, lang.errors.modChannel);

        if (!args[0]) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.InvalidArgument, lang.errors.noText);

        if (!message.guild.members?.me) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.unknownError);

        // Check channel permissions
        if (!channel.permissionsFor(message.guild.members.me).has([PermissionFlagsBits.SendMessages]))
            return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.noPerms);

        if (!message.member) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.unknownError);

        if (!channel.permissionsFor(message.member).has([PermissionFlagsBits.SendMessages]))
            return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.CommandFailure, lang.errors.userNoPerms);

        const msg = message.content.slice(message.content.indexOf(args[0]), message.content.length);
        channel.send(
            {
                content: msg
            }
        )
    }
};

export = command;