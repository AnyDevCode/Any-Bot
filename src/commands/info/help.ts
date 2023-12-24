import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';
import { Command } from '../command';

let command: CommandOptions = {
    name: "help",
    type: CommandTypes.Info,
    aliases: ["h"],
    usage: "help <command | category>",
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("help") || client.language.get("en")?.get("help");
        const topicLang = client.language.get(language || "en")?.get("thetopics") || client.language.get("en")?.get("thetopics");

        //Get all categories
        const categories = client.commands.map(cmd => cmd.type).filter((value, index, self) => self.indexOf(value) === index);

        //If the user is not the owner th bot, remove the owner category
        if (!client.isOwner(message.author)) {
            for (let i = 0; i < categories.length; i++) {
                if (categories[i] === CommandTypes.Owner) {
                    categories.splice(i, 1);
                    break;
                }
            }
        }

        //If the channel is not NSFW, remove the NSFW category
        if (!message.channel.isDMBased() && message.channel.isTextBased() && !message.channel.isThread() && !message.channel.nsfw) {
            for (let i = 0; i < categories.length; i++) {
                if (categories[i] === CommandTypes.NSFW) {
                    categories.splice(i, 1);
                    break;
                }
            }
        }

        //Now make a map with the categories and the commands
        const commands = new Map<string, Command>();
        //Add description to all commands and add them to the map
        client.commands.forEach((cmd: Command) => {
            if (cmd.disabled) return;
            cmd.description = client.language.get(language || "en")?.get(cmd.name)?.description || client.language.get("en")?.get(cmd.name)?.description || lang.noneDescription;
            commands.set(cmd.name, cmd);
        });



        //If the user didn't provide any argument, send the help embed
        if (!args[0]) {
            const embed = new EmbedBuilder()
                .setTitle(lang.title)
                .setColor(client.user?.hexAccentColor || message.author.hexAccentColor || "Random")
                .setFooter({
                    text: message.author.username,
                    iconURL: message.author.displayAvatarURL()
                })
                .setTimestamp()
                .addFields(categories.map(category => ({
                    name: topicLang[category as CommandTypes]?.name || "Indefinido",
                    value: Array.from(commands.values())
                        .filter(cmd => cmd.type === category)
                        .map(cmd => `\`${cmd.name}\``)
                        .join(", ")
                })))
                .setThumbnail(client.user?.displayAvatarURL() || message.author.displayAvatarURL())

            return message.channel.send({ embeds: [embed] });
        }

        //If the user provided a category, send the commands in that category
        if (categories.includes(client.utils.Capitalize(args[0]) as CommandTypes)) {
            const embed = new EmbedBuilder()
                .setTitle(lang.title)
                .setColor(client.user?.hexAccentColor || message.author.hexAccentColor || "Random")
                .setFooter({
                    text: message.author.username,
                    iconURL: message.author.displayAvatarURL()
                })
                .setTimestamp()
                .setThumbnail(client.user?.displayAvatarURL() || message.author.displayAvatarURL())
                .setDescription(client.commands.filter(cmd => cmd.type === client.utils.Capitalize(args[0]) as CommandTypes).map(cmd => `\`${cmd.name}\``).join(", "))

            return message.channel.send({ embeds: [embed] });
        }

        //If the user provided a command, send the command's info
        if (commands.has(args[0])) {
            const embed = new EmbedBuilder()
                .setTitle(lang.title)
                .setColor(client.user?.hexAccentColor || message.author.hexAccentColor || "Random")
                .setFooter({
                    text: message.author.username,
                    iconURL: message.author.displayAvatarURL()
                })
                .setTimestamp()
                .addFields([
                    {
                        name: lang.helpName,
                        value: `\`${commands.get(args[0])?.name}\``,
                        inline: true
                    },
                    {
                        name: lang.helpAliases,
                        value: commands.get(args[0])?.aliases?.length ? commands.get(args[0])?.aliases?.map((alias: string) => `\`${alias}\``).join(", ") : lang.noneAliases,
                        inline: true
                    },
                    {
                        name: lang.helpUsage,
                        value: `\`${commands.get(args[0])?.usage || lang.noneUsage}\``,
                        inline: true
                    },
                    {
                        name: lang.helpCategory,
                        value: `\`${topicLang[commands.get(args[0])?.type as CommandTypes].name}\``,
                        inline: true
                    },
                    {
                        name: lang.helpCooldown,
                        value: `\`${commands.get(args[0])?.cooldown ? commands.get(args[0])?.cooldown + "s" : lang.noneCooldown}\``,
                        inline: true
                    },
                    {
                        name: lang.helpDescription,
                        value: `\`\`\`\n${commands.get(args[0])?.description || lang.noneDescription}\`\`\``,
                    }
                ])
                .setThumbnail(client.user?.displayAvatarURL() || message.author.displayAvatarURL())

            return message.channel.send({ embeds: [embed] });
        }

        //If the user provided an invalid argument, send an error message
        const embed = new EmbedBuilder()
            .setTitle(lang.title)
            .setColor(client.user?.hexAccentColor || message.author.hexAccentColor || "Random")
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp()
            .setThumbnail(client.user?.displayAvatarURL() || message.author.displayAvatarURL())
            .setDescription(lang.invalid);

        return message.channel.send({ embeds: [embed] });
    }
}

export = command;