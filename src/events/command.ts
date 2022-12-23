import { Events, Message, EmbedBuilder } from "discord.js";
import { Bot } from "../client";

export = {
    name: Events.MessageCreate,
    run: async (message: Message, client: Bot) => {
        const guildData = await client.database.settings.selectRow(message.guild?.id)
        const lang = client.language.get(guildData?.language || "en")?.get("command") || client.language.get("en")?.get("command");
        const prefix = guildData?.prefix || client.prefix;
        if (message.author.bot) return;
        if (!message.guild) return;
        if (!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName) return;
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;
        if (command.ownerOnly && !client.isOwner(message.author)) return message.channel.send(lang?.errors.ownerOnly);
        if (command.disabled) return message.channel.send(lang?.errors.disabled);
        if (!message.channel.isDMBased() && !message.channel.isThread() && command.nsfw && !message.channel.nsfw) return message.channel.send(lang?.errors.nsfw);
        if (command.userPermissions && !message.channel.isDMBased()) {
            const missingPermissions = message.channel.permissionsFor(message.author)?.missing(command.userPermissions).map(p => p);
            if (missingPermissions?.length !== 0 && typeof missingPermissions !== 'undefined') {
                const embed = new EmbedBuilder()
                    .setTitle(lang?.errors.missingPermissions.user.title)
                    .setDescription(lang?.errors.missingPermissions.user.description.replace("%%PERMS%%", missingPermissions.join(", ")))
                    .setColor(message.guild.members.me?.displayHexColor || message.author.hexAccentColor || "Random")
                return message.channel.send({ embeds: [embed] });
            }
        }
        if (command.botPermissions && !message.channel.isDMBased() && message.guild?.members?.me) {
            const missingPermissions = message.channel.permissionsFor(message.guild?.members?.me)?.missing(command.botPermissions).map(p => p);
            if (missingPermissions?.length !== 0 && typeof missingPermissions !== 'undefined') {
                const embed = new EmbedBuilder()
                    .setTitle(lang?.errors.missingPermissions.bot.title)
                    .setDescription(lang?.errors.missingPermissions.bot.description.replace("%%PERMS%%", missingPermissions.join(", ")))
                    .setColor(message.guild.members.me?.displayHexColor || message.author.hexAccentColor || "Random")
                return message.channel.send({ embeds: [embed] });
            }
        }
        if (command.cooldown) {
            if (!client.cooldowns.has(command.name)) {
                client.cooldowns.set(command.name, new Map());
            }
            const now = Date.now();
            const timestamps = client.cooldowns.get(command.name);
            if (!timestamps) return;
            const cooldownAmount = (command.cooldown || 3) * 1000;
            if (timestamps.has(message.author.id)) {
                const userTime = timestamps.get(message.author.id) || 0;
                const expirationTime = userTime + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.channel.send(lang?.errors.cooldown.replace("%%TIME%%", timeLeft.toFixed(1)).replace("%%CMD%%", command.name));
                }
            }
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }
        try {
            command.run(message, args, client, guildData?.language || "en");
        } catch (err) {
            console.log(err);
            message.channel.send(lang?.errors.unknown);
        }
    }
}

