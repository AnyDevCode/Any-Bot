import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder, User } from 'discord.js';

let command: CommandOptions = {
    name: "discriminator",
    type: CommandTypes.Info,
    aliases: ["discrim", "disc", "discs"],
    usage: "discriminator <discriminator | user mention | user id>",
    examples: ["discriminator 0001", "discriminator @user", "discriminator 123456789"],
    cooldown: 30,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("discriminator") || client.language.get("en")?.get("discriminator");

        const guild = message.guild || await client.guilds.fetch(message.guildId || "");

        const members = await guild.members.fetch();

        const member = await client.utils.getMemberFromMentionOrID(message, args[0]) ||
        message.member;

        let users:User[]

        if(!member) {
            if(!args[0]){
                return client.utils.sendErrorEmbed(client, language, message, this, client.utils.CommandsErrorTypes.InvalidArgument, lang.errors.noUser);
            } else if(args[0].length !== 4){
                return client.utils.sendErrorEmbed(client, language, message, this, client.utils.CommandsErrorTypes.InvalidArgument, lang.errors.invalidDiscriminator);
            } else {
                users = members.filter(m => m.user.discriminator === args[0]).map(m => m.user);
            }
        }
        else users = members.filter(m => m.user.discriminator === member.user.discriminator).map(m => m.user);

        const embed = new EmbedBuilder()
        .setTitle(lang.embed.title.replace(/%%DISCRIMINATOR%%/g, users[0].discriminator))
        .setColor(client.user?.hexAccentColor || message.author.hexAccentColor || "Random")
        .setFooter({
            text: message.author.username,
            iconURL: message.author.displayAvatarURL()
        })
        .setTimestamp()
        
        if(!users.length) return message.channel.send({ embeds: [embed.setDescription(`\`\`\`\n${lang.embed.noUsers}\`\`\``)] })

        
        return message.channel.send({ embeds: [embed.setDescription(`\`\`\`\n${client.utils.limitString(users.map(u => u.tag).join("\n"), 4096)}\`\`\``)] })
    }
}

export = command;