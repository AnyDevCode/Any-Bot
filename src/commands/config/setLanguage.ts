import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import Languages from '../../utils/languages.json';

let command: CommandOptions = {
    name: "setlanguage",
    type: CommandTypes.Config,
    aliases: ["setlang"],
    usage: "setlanguage <language>",
    examples: ["setlanguage en", "setlanguage es"],
    userPermissions: [PermissionsBitField.Flags.ManageGuild],
    cooldown: 60,
    async run(message, args, client, language) {

        let firstLanguage = client.language.get(language || "en")?.get("setlanguage") || client.language.get("en")?.get("setlanguage");
        if (!args[0]) {
            let languages = client.language.map((_value, key) => key);

            for (let i = 0; i < languages.length; i++) {
                languages[i] = `${languages[i]} - ${Languages[languages[i] as keyof typeof Languages]}`;
            }

            let embed = new EmbedBuilder()
                .setTitle(firstLanguage.noArgs.title)
                .setColor(client.user?.hexAccentColor || message.author.hexAccentColor || message.guild?.members.cache.get(client.user?.id as string)?.roles.color?.color || "Random")
                .setTimestamp()
                .setDescription(languages.join("\n"))
                .addFields({
                    name: firstLanguage.noArgs.current,
                    value: Languages[language as keyof typeof Languages]
                })
                .setFooter({
                    text: message.guild?.name || message.author.username,
                    iconURL: message.guild?.iconURL() || message.author.displayAvatarURL()
                })
            return message.reply({ embeds: [embed] });
        }
        let lang = args[0].toLowerCase();
        if (!client.language.has(lang)) return message.reply(firstLanguage.invalidLanguage);
        if (language === lang) return message.reply(firstLanguage.sameLanguage);
        await client.database.settings.setLanguage(message.guild?.id, lang);
        // return message.reply("Language set to " + Languages[lang as keyof typeof Languages]);
        const secondLanguage = client.language.get(lang)?.get("setlanguage") || client.language.get("en")?.get("setlanguage");
        return message.reply(secondLanguage.success.replace(/%%LANGUAGE%%/g, Languages[lang as keyof typeof Languages]));
    }
}

export = command;