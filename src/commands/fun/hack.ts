import { CommandTypes, CommandOptions } from '../../utils/utils';
import { EmbedBuilder } from 'discord.js';

let command: CommandOptions = {
    name: "hack",
    type: CommandTypes.Fun,
    examples: [
        'hack @MDC',
        'hack 123456789'
    ],    usage: 'hack [mention/id]',
    cooldown: 15,
    premiumCooldown: 10,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("hack") || client.language.get("en")?.get("hack");

        const member = await client.utils.getMemberFromMentionOrID(message, args[0]) ||
        message.member;

        let { firstName, lastName, email, password, gender, ipAddress, macAddress, country, phoneNumber, city, streetAddress, domain, creditCard, creditCardType, creditCardExpireDate, creditCardCVV, bitcoinAdress, ethereumAdress } = client.utils.generateRandomUserData()[0];

        let embed = new EmbedBuilder()
            .setColor(message.guild?.members.me?.displayHexColor || "Random")
            .setAuthor({
                name: lang?.embeds[0]?.title?.replace(/%%AUTHOR%%/g, message.author.username).replace(/%%MEMBER%%/g, member?.displayName),
                iconURL: message.author.displayAvatarURL()
            })
            .setDescription(lang?.embeds[0]?.description)

        let msg = await message.channel.send({embeds: [embed]});

        let embed2 = new EmbedBuilder()
            .setColor(message.guild?.members.me?.displayHexColor || "Random")
            .setAuthor({
                name: lang?.embeds[1]?.title.replace(/%%AUTHOR%%/g, message.author.username).replace(/%%MEMBER%%/g, member?.displayName),
                iconURL: message.author.displayAvatarURL()
            })            
            .setDescription(lang?.embeds[1]?.description)

        await new Promise(resolve => setTimeout(resolve, 2000));

        await msg.edit({embeds: [embed2]});

        let final_embed = new EmbedBuilder()
            .setColor(message.guild?.members.me?.displayHexColor || "Random")
            .setAuthor({
                name: lang?.embeds[2]?.title?.replace(/%%MEMBER%%/g, member?.user.tag),
                iconURL: message.author.displayAvatarURL()
            })     
            .setThumbnail(member?.user.displayAvatarURL() || "")
            .addFields({
                name: lang?.embeds[2]?.fields[0]?.name,
                value: firstName,
                inline: true
            }, {
                name: lang?.embeds[2]?.fields[1]?.name,
                value: lastName,
                inline: true
            }, {
                name: lang?.embeds[2]?.fields[2]?.name,
                value: email,
                inline: true
            }, {
                name: lang?.embeds[2]?.fields[3]?.name,
                value: password,
                inline: true
            }, {
                name: lang?.embeds[2]?.fields[4]?.name,
                value: gender,
                inline: true,
            },{
                name: lang?.embeds[2]?.fields[5]?.name,
                value: ipAddress,
                inline: true
            }, {
                name: lang?.embeds[2]?.fields[6]?.name,
                value: macAddress,
                inline: true
            }, {
                name: lang?.embeds[2]?.fields[7]?.name,
                value: country,
                inline: true
            }, {
                name: lang?.embeds[2]?.fields[8]?.name,
                value: phoneNumber,
                inline: true
            }, {
                name: lang?.embeds[2]?.fields[9]?.name,
                value: city,
                inline: true
            }, {
                name: lang?.embeds[2]?.fields[10]?.name,
                value: streetAddress,
                inline: true
            }, {
                name: lang?.embeds[2]?.fields[11]?.name,
                value: creditCard,
                inline: true
            }, {
                name: lang?.embeds[2]?.fields[12]?.name,
                value: creditCardType,
                inline: true
            }, {
                name: lang?.embeds[2]?.fields[13]?.name,
                value: creditCardExpireDate,
                inline: true
            }, {
                name: lang?.embeds[2]?.fields[14]?.name,
                value: creditCardCVV,
                inline: true
            }, {
                name: lang?.embeds[2]?.fields[15]?.name,
                value: bitcoinAdress,
                inline: true
            }, {
                name: lang?.embeds[2]?.fields[16]?.name,
                value: ethereumAdress,
                inline: true
            }, {
                name: lang?.embeds[2]?.fields[17]?.name,
                value: domain,
                inline: true
            })

        await new Promise(resolve => setTimeout(resolve, 4000));

        await msg.edit({embeds: [final_embed]});

    }
}

export = command;