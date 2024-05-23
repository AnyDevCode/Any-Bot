import { CommandTypes, CommandOptions, CommandsErrorTypes } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';
const rps = ['✌️', '✊', '✋']; 

let command: CommandOptions = {
    name: 'rps',
    usage: 'rps <✌️ | ✊ | ✋>',
    type: CommandTypes.Fun,
    examples: ['rps ✌️', 'rps ✊', 'rps ✋'],
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("rps") || client.language.get("en")?.get("rps");
        const res = lang?.rps;
        if (args.length < 1) return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.InvalidArgument, lang?.errors?.invalidArgument);
        let userChoice: string | number = args[0].toLowerCase();
        if (!rps.includes(userChoice)) client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.InvalidArgument, lang?.errors?.invalidArgument);
        userChoice = rps.indexOf(userChoice);
        const botChoice = Math.floor(Math.random() * 3);
        let result: string;
        if (userChoice === botChoice) result = lang?.result?.draw;
        else if (botChoice > userChoice || botChoice === 0 && userChoice === 2) result = lang?.result?.lose?.replace(/%%BOT%%/g, client.user?.username);
        else result = lang?.result?.win?.replace(/%%AUTHOR%%/g, message.author.username);

        const embed = new EmbedBuilder()
            .setTitle(lang?.embed?.title?.replace(/%%AUTHOR%%/g, message.author.username).replace(/%%BOT%%/g, client.user?.username))
            .addFields([
                { name: lang?.embed?.fields[0].name, value: res[userChoice], inline: true },
                { name: lang?.embed?.fields[1].name.replace(/%%BOT%%/g, client.user?.username), value: res[botChoice], inline: true },
                { name: lang?.embed?.fields[2].name, value: result, inline: true }
            ])
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setTimestamp()
            .setColor(message.guild?.members.me?.displayHexColor || 'Random');
        message.reply({ embeds: [embed] });
    }
}

export = command;