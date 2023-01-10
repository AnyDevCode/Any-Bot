import { Events, Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Bot } from "../client";

export = {
    name: Events.MessageCreate,
    run: async (message: Message, client: Bot) => {
        const guildData = await client.database.settings.selectRow(message.guild?.id)
        const lang = client.language.get(guildData?.language || "en")?.get("command") || client.language.get("en")?.get("command");
        const permissions = client.language.get(guildData?.language || "en")?.get("permissions") || client.language.get("en")?.get("permissions");
        if (message.author.bot) return;
        if (!message.guild) return;

        const prefix = guildData?.prefix || client.prefix;
        const prefixRegex = new RegExp(
            `^(<@!?${client.user?.id}>|${prefix.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            )})\\s*`
        );
        if (!prefixRegex.test(message.content)) return;
        /* @ts-ignore */
        const [, matchedPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        if((prefixRegex.test(message.content) && message.mentions.users.first()?.id === client.user?.id) && !commandName) {
            const embed = new EmbedBuilder()
                .setTitle(lang?.info.title.replace("%%BOTNAME%%", message.client.user?.username || ""))
                .setThumbnail(message.client.user?.displayAvatarURL() || message.author.displayAvatarURL())
                .setDescription(lang?.info.description.replace("%%PREFIX%%", prefix))
                .addFields({
                    name: lang?.info.fields[0].name,
                    value: lang?.info.fields[0].value.replace("%%BOTID%%", message.client.user?.id || "")
                }, {
                    name: lang?.info.fields[1].name,
                    value: lang?.info.fields[1].value.replace("%%BOTNAME%%", message.client.user?.username || "").replace("%%BOTSUPPORT%%", client.supportServerInvite || "")
                })
                .setColor(message.guild.members.me?.displayHexColor || message.author.hexAccentColor || "Random")

            const linkrow = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel(lang?.info.buttons[0].label)
                        .setURL(`https://discord.com/oauth2/authorize?client_id=${message.client.user?.id}&scope=bot&permissions=8`),
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel(lang?.info.buttons[1].label)
                        .setURL(client.supportServerInvite || "")
                )
                
            return message.channel.send({ embeds: [embed], components: [linkrow] })
        }
        if (!commandName) return;
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;
        if (command.ownerOnly && !client.isOwner(message.author)) return message.channel.send(lang?.errors.ownerOnly);
        if (command.disabled) return message.channel.send(lang?.errors.disabled);
        if (!message.channel.isDMBased() && !message.channel.isThread() && command.nsfw && !message.channel.nsfw) return message.channel.send(lang?.errors.nsfw);
        if (command.userPermissions && !message.channel.isDMBased()) {
            const missingPermissions = message.channel.permissionsFor(message.author)?.missing(command.userPermissions).map(p => permissions[p]);
            if (missingPermissions?.length !== 0 && typeof missingPermissions !== 'undefined') {
                const embed = new EmbedBuilder()
                    .setTitle(lang?.errors.missingPermissions.user.title)
                    .setDescription(lang?.errors.missingPermissions.user.description.replace("%%PERMS%%", "- "+missingPermissions.join("\n- ")))
                    .setColor(message.guild.members.me?.displayHexColor || message.author.hexAccentColor || "Random")
                    .setThumbnail(message.client.user?.displayAvatarURL() || message.author.displayAvatarURL())
                return message.channel.send({ embeds: [embed] });
            }
        }
        if (command.botPermissions && !message.channel.isDMBased() && message.guild?.members?.me) {
            const missingPermissions = message.channel.permissionsFor(message.guild?.members?.me)?.missing(command.botPermissions).map(p => permissions[p]);
            if (missingPermissions?.length !== 0 && typeof missingPermissions !== 'undefined') {
                const embed = new EmbedBuilder()
                    .setTitle(lang?.errors.missingPermissions.bot.title)
                    .setDescription(lang?.errors.missingPermissions.bot.description.replace("%%PERMS%%", "- "+missingPermissions.join("\n- ")))
                    .setColor(message.guild.members.me?.displayHexColor || message.author.hexAccentColor || "Random")
                    .setThumbnail(message.client.user?.displayAvatarURL() || message.author.displayAvatarURL())
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
            let cooldownAmount = (command.cooldown) * 1000;
            let isPremium = false;
            if(command.premiumCooldown) {
                isPremium = await client.database.premium.isPremium(message.guild?.id || "");
                if(isPremium) cooldownAmount = (command.premiumCooldown) * 1000;
            }
            if (timestamps.has(message.author.id)) {
                const userTime = timestamps.get(message.author.id) || 0;
                const expirationTime = userTime + cooldownAmount;
                if (now < expirationTime) {
                    if(command.premiumCooldown && !isPremium) {
                        const timeLeft = (expirationTime - now) / 1000;
                        const premiumTimeLeft = (userTime + (command.premiumCooldown * 1000) - now) / 1000;
                        if(premiumTimeLeft > 0){
                            return message.channel.send(lang?.errors.premiumCooldown.normal.replace("%%TIME%%", timeLeft.toFixed(1)).replace("%%CMD%%", command.name).replace("%%PREMIUMTIME%%", premiumTimeLeft.toFixed(1)));
                        } else {
                            return message.channel.send(lang?.errors.premiumCooldown.instant.replace("%%TIME%%", timeLeft.toFixed(1)).replace("%%CMD%%", command.name));
                        }
                    } else {
                        const timeLeft = (expirationTime - now) / 1000;
                        return message.channel.send(lang?.errors.cooldown.replace("%%TIME%%", timeLeft.toFixed(1)).replace("%%CMD%%", command.name));
                    }
                }
            }
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

        if (command.premiumOnly) {
            const isPremium = await client.database.premium.isPremium(message.guild?.id || "");
            if (!isPremium) return message.channel.send(lang?.errors.premiumOnly);
        }

        try {
            command.run(message, args, client, guildData?.language || "en");
        } catch (err) {
            console.log(err);
            message.channel.send(lang?.errors.unknown);
        }
    }
}

