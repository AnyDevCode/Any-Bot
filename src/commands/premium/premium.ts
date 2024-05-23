import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';

let command: CommandOptions = {
    name: "premium",
    aliases: ["prem"],
    type: CommandTypes.Premium,
    usage: "premium [code]",
    examples: ["premium ######-######-######-######-######-######"],
    cooldown: 0,
    async run(message, args, client) {

        let isPremium = await client.database.premium.isPremium(message.guild?.id || message.author.id);
        
        if(!args[0] && !isPremium) return message.reply("You are not premium");
        if(!args[0] && isPremium) {
            const guildData = await client.database.premium.get(message.guild?.id || message.author.id);
            if(!guildData) return message.reply("An error occured")
            let embed = new EmbedBuilder()
            .setColor("Random")
            .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL()
            })
            .setTitle("Premium")
            .setDescription(`You are premium until <t:${Math.floor(guildData.expiresAt.getTime() / 1000)}:R>`);
            return message.reply({embeds: [embed]});
        }


        let code = args[0];

        let premium = await client.database.premiumCodes.get(code);

        if(!premium) return message.reply("Invalid code");

        let time;
        switch(premium.plan) {
            case "daily":
                time = 1000 * 60 * 60 * 24;
                break;
            case "weekly":
                time = 1000 * 60 * 60 * 24 * 7;
                break;
            case "monthly":
                time = 1000 * 60 * 60 * 24 * 30;
                break;
            case "yearly":
                time = 1000 * 60 * 60 * 24 * 365;
                break;
            case "lifetime":
                time = 1000 * 60 * 60 * 24 * 365 * 100;
                break;
            default:
                time = 0;
        }


        if(premium.uses <= 0) return message.reply("This code has been used");

        if(isPremium) {
            const guildData = await client.database.premium.get(message.guild?.id || message.author.id);
            if(!guildData) return message.reply("An error occured")
            await client.database.premiumCodes.use(code);
            await client.database.premium.update(message.guild?.id || message.author.id, new Date( guildData.expiresAt.getTime() + time), true);
            return message.reply("Successfully added premium to your server");
        } else {
            await client.database.premiumCodes.use(code);
            await client.database.premium.update(message.guild?.id || message.author.id, new Date(new Date().getTime() + time), true);
            return message.reply("Successfully added premium to your server");
        }
    }

}

export = command;