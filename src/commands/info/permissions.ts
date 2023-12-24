import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder, PermissionsBitField } from 'discord.js';

let command: CommandOptions = {
    name: "permissions",
    description: "Shows the permissions of a user or role",
    type: CommandTypes.Info,
    aliases: ["perms"],
    usage: "permissions <user | role>",
    async run(message, args, client, language) {
        const permissions = client.language.get(language || "en")?.get("permissions") || client.language.get("en")?.get("permissions");
        const lang = client.language.get(language || "en")?.get("permissions-command") || client.language.get("en")?.get("permissions-command");
        let member = await client.utils.getMemberFromMentionOrID(message, args[0]) || message.member;
        let role = message.mentions.roles.first() || message.guild?.roles.cache.get(args[0]);
        if (!member && !role) return message.channel.send(lang.errors.noUserOrRole);
        if (role) {
            let rolePerms = [];
            for (let key in permissions) {
                if (role.permissions.has(key as unknown as PermissionsBitField)) rolePerms.push(`+ ${permissions[key]}`);
                else rolePerms.push(`- ${permissions[key]}`);
            }
            let embed = new EmbedBuilder()
                .setTitle(lang.roleEmbed.title.replace(/%%ROLE%%/g, role.name))
                .setColor(role.hexColor || message.author.hexAccentColor || "Random")
                .setTimestamp()
                .setFooter({
                    text: message.guild?.name || message.author.username,
                    iconURL: message.guild?.iconURL() || message.author.displayAvatarURL()
                })
                .setDescription(`\`\`\`diff\n${rolePerms.join("\n")}\`\`\``)
            return message.channel.send({ embeds: [embed] });
        }
        if (member) {
            let memberPerms = [];
            for (let key in permissions) {
                if (member.permissions.has(key as unknown as PermissionsBitField)) memberPerms.push(`+ ${permissions[key]}`);
                else memberPerms.push(`- ${permissions[key]}`);
            }

            let embed = new EmbedBuilder()
                .setTitle(lang.userEmbed.title.replace(/%%USER%%/g, member.user.tag))
                .setColor(member.user.hexAccentColor || message.author.hexAccentColor || "Random")
                .setTimestamp()
                .setFooter({
                    text: message.guild?.name || message.author.username,
                    iconURL: message.guild?.iconURL() || message.author.displayAvatarURL()
                })

                .setDescription(`\`\`\`diff\n${memberPerms.join("\n")}\`\`\``)
            return message.channel.send({ embeds: [embed] });
        }
    }
}

export = command;