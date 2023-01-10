import { Message, User, Guild, Attachment, EmbedBuilder } from 'discord.js';
import { Bot } from "../client";
import axios from 'axios';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { faker } from '@faker-js/faker';

function Capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

async function getMemberAvatar(user: User, guild: Guild, client: Bot, size: string | number | null = 1024): Promise<string | null> {
    try {
        const data = await axios
            .get(
                `https://discord.com/api/guilds/${guild.id}/members/${user.id}`,
                {
                    headers: {
                        Authorization: `Bot ${client.token}`,
                    },
                }
            )
            .then((d) => d.data);

        if (data.avatar && data.avatar !== user.avatar) {
            let url = data.avatar.startsWith("a_")
                ? size
                    ? ".gif?size=" + size
                    : ".gif?size=4096"
                : size
                    ? ".png?size=" + size
                    : ".png?size=4096";
            url = `https://cdn.discordapp.com/guilds/${guild.id}/users/${user.id}/avatars/${data.avatar}${url}`;
            return url;
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
}

async function getUserBanner(user: User, client: Bot, message: Message, size: string | number | null = 1024): Promise<string | null> {
    let userInformation = await message.client.users.fetch(message.author.id);
    if (userInformation.banner) {
        let url = userInformation.banner.startsWith("a_")
            ? size
                ? ".gif?size=" + size
                : ".gif?size=4096"
            : size
                ? ".png?size=" + size
                : ".png?size=4096";
        url = `https://cdn.discordapp.com/banners/${userInformation.id}/${userInformation.banner}${url}`;
        return url;
    } else {
        return null;
    }
}

async function upload(attach: Attachment, message: Message, client: Bot, maxRetry: number = 3, retry: number = 0): Promise<string> {
    const file = await axios.post(client.cdnURL + "/upload", {
        url: attach.url,
        name: message.id + "-" + attach.id + "-" + attach.name,
    }, {
        headers: {
            authorization: client.apiKeys.get("CDNAPIKEY")
        }
    })
        .then((res) => res.data)
        .catch(async (_err) => {
            if (retry < maxRetry) {
                retry++;
                return await upload(attach, message, client, maxRetry, retry)
            }
            return attach.url;
        });

    if (file.error) {
        if (retry < maxRetry) {
            retry++;
            return await upload(attach, message, client, maxRetry, retry)
        }
        return attach.url;
    }

    return file.url
}

function getMemberFromMention(message: Message, mention: string) {
    if (!mention) return;
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    if(!message.guild) return;
    return message.guild.members.cache.get(id);
  }

//Interface with Types for Commands, like "Utils", "Fun", "Moderation", etc.
enum CommandTypes {
    Utils = "Utils",
    Fun = "Fun",
    Moderation = "Moderation",
    Owner = "Owner",
    Economy = "Economy",
    Games = "Games",
    NSFW = "NSFW",
    Image = "Image",
    Utility = "Utility",
    Info = "Info",
    Config = "Config",
    Bot = "Bot",
    Other = "Other",
    Giveaway = "Giveaway",
    Ticket = "Ticket",
    Leveling = "Leveling",
    Discord = "Discord",
    Anime = "Anime",
    Roleplay = "Roleplay",
    Animals = "Animals",
    Internet = "Internet",
    Premium = "Premium"
}

enum CommandsErrorTypes {
    InvalidArgument = 'InvalidArgument',
    CommandFailure = 'CommandFailure',
    NotNSFW = 'ThisisnotaNSFWchannel',
    MissingPermissions = 'MissingPermissions',
    NoDataFound = 'NoDataFound'
}

async function sendErrorEmbed(client: Bot, language: string, message: Message, command: CommandOptions, errorType: CommandsErrorTypes, reason: string, errorMessage: string | null = null): Promise<void | Message> {
    const lang = client.language.get(language || "en")?.get("utils") || client.language.get("en")?.get("utils");
    const CommandsErrorTypesLang = client.language.get(language || "en")?.get("commandserrortypes") || client.language.get("en")?.get("commandserrortypes");

    const prefix = await client.database.settings.selectPrefix(message.guild?.id);
    const embed = new EmbedBuilder()
    .setAuthor({
        name: `${message.author.username}`,
        iconURL: message.author.displayAvatarURL()
    })
    .setTitle(`${lang.embed.title} \`${command.name}\``)
    .setDescription(`\`\`\`diff\n- ${CommandsErrorTypesLang[errorType]}\n+ ${reason}\`\`\``)
    .addFields({
        name: lang.embed.fields[0].title,
        value: `\`${prefix}${command.usage}\``
    })
    .setTimestamp()
    .setColor(message?.member?.displayHexColor || message.guild?.members.me?.displayHexColor || 'Random')

    if(command.examples) embed.addFields({
        name: lang.embed.fields[1].title,
        value: command.examples.map((e) => `\`${prefix}${e}\``).join('\n')
    })
    if(errorMessage) embed.addFields({
        name: lang.embed.fields[2].title,
        value: `\`\`\`\n${errorMessage}\`\`\``
    })

    return message.channel.send({
        embeds: [embed]
    })

}

async function createTempFile(): Promise<fs.WriteStream> {
    const randomName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const tempFile = path.join(os.tmpdir(), randomName);
    return fs.createWriteStream(tempFile);
}

async function writeToFile(file: fs.WriteStream, data: string): Promise<void> {
    return new Promise((resolve, reject) => {
        file.write(data, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}

async function deleteFile(file: fs.WriteStream): Promise<void> {
    return new Promise((resolve, reject) => {
        file.close((err) => {
            if (err) reject(err);
            resolve();
        });
    });
}

function getRange(arr: any[], current: number, interval: number) {
    const max = arr.length > current + interval ? current + interval : arr.length;
    current = current + 1;
    return arr.length === 1 || arr.length === current || interval === 1
      ? `[${current}]`
      : `[${current} - ${max}]`;
  }
  
function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

async function chatBot(text: string, client: Bot, message: Message){
    const data = {
        message: encodeURIComponent(text),
        name: client.user?.username || "ChatBot", 
        master: client.users.cache.get(client.ownerID || "")?.username || "MDC", 
        user: message.author.id, 
        age: "2", 
        boyfriend: client.user?.username || "ChatBot", 
        genus: "Robot", 
        size: "+250 servers", 
        species: "robot", 
        location: "Google Drive", 
        order: "chatbot", 
        birthday: "July 17", 
        kingdom: "chatbot", 
        gender: "agender", 
        favoritefood: "code", 
        emotions: "happy", 
        mother: "MDC", 
        state: "online", 
        country: "Internet", 
        nationality: "Google User", 
        city: "Google Drive", 
        phylum: "chatbot", 
        domain: "any-bot.xyz", 
        family: "chatbot", 
        vocabulary: "20000", 
        class: "chatbot", 
        email: "me@mdcdev.me", 
        kindmusic: "Pop", 
        favoritemovie: "Ratatouille", 
        language: "Javascript", 
        job: "Helper", 
        birthplace: "Discord", 
        religion: "Atheist", 
        celebrities: "Duxo", 
        arch: "Linux", 
        version: "3", 
        talkabout: "coding", 
        website: "https://any-bot.xyz", 
        favoritebook: "The Little Prince", 
        favoritesport: "Volley", 
        favoritesong: "Wolf in Sheep's Clothing", 
        favoritecolor: "Sky Blue", 
        favoriteshow: "The Walking Dead",
        favoritetea: "Green Tea",
        favoriteoccupation: "chatbot",
        favoriteseason: "Winter",
        favoriteartist: "Keki",
        favoriteband: "The Living Tombstone",
        favoritesubject: "maths",
        forfun: "chat",
        build: "Node.js",
        etype: "chatbot",
        sign: "Cancer",
        looklike: "chatbot",
        wear: "my programmer socks",
        os: "Linux",
        question: "How are you?",
        dailyclients: "20k +",
        nclients: "200k +",
        totalclients: "500k +",
        birthdate: "July 17 2020",
        ndevelopers: "1",
        memory: "256 GB",
        alignment: "asexual",
        celebrity: "Duxo",
        favoritequestion: "How are you?",
        feelings: "happy",
        friend: "Dyno",
        girlfriend: "Ana Bot",
        hourlyqueries: "1000+",
        maxclients: "100k +",
        orientation: "arromantic",
        president: "Joe Biden",
        richness: "Poor",
        ethics: "the golden rule",
        birthyear: "2020",
    }

    let i = 0;

    while(i < 10){
        try {
            const res = await axios.get("https://api.lebyy.me/api/chatbot?" + new URLSearchParams(data).toString(), {
                headers: {
                    "Authorization": client.apiKeys.get("CHATBOTAPIKEY") || ""
                }
            })
    
            if(res.data.message){
                return res.data.message
            } else {
                i++
            }
    
            await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (error) {
            i++

            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    }

    return "I'm having some issues right now, please try again later."
}

function generateRandomUserData(amount = 1){
    const data = [];

    for(let i = 0; i < amount; i++){
        const randomGender = Math.floor(Math.random() * 2) === 0 ? "female" : "male"
        const randomFirstName = faker.name.firstName(randomGender)
        const randomLastName = faker.name.lastName(randomGender)
        const randomEmail = faker.internet.email(randomFirstName, randomLastName);
        const randomPassword = faker.internet.password(Math.floor(Math.random() * 10) + 8, true);
        const randomIPAddress = faker.internet.ip();
        const randomMACAddress = faker.internet.mac("-");
        const randomCountry = faker.address.country();
        const randomPhoneNumber = faker.phone.number();
        const randomCity = faker.address.city();
        const randomStreetAddress = faker.address.streetAddress(true);
        const randomDomain = faker.internet.domainName();
        let randomCreditCard, randomCreditCardType, randomCreditCardExpireDate, randomCreditCardCVV, randomBitcoinAdress, RandomEthereumAdress;

        if(Math.floor(Math.random() * 2) === 0){
            randomCreditCardType = faker.finance.creditCardIssuer();
            randomCreditCard = faker.finance.creditCardNumber(randomCreditCardType);
            randomCreditCardExpireDate = Math.floor(Math.random() * 12) + 1 + "/" + (new Date().getFullYear() + Math.floor(Math.random() * 5) + 1);
            randomCreditCardCVV = faker.finance.creditCardCVV();
        }

        if(Math.floor(Math.random() * 10) === 0){
            randomBitcoinAdress = faker.finance.bitcoinAddress();
        }

        if(Math.floor(Math.random() * 8) === 0){
            RandomEthereumAdress = faker.finance.ethereumAddress();
        }



        data.push({
            firstName: randomFirstName,
            lastName: randomLastName,
            email: randomEmail,
            password: randomPassword,
            gender: Capitalize(randomGender),
            ipAddress: randomIPAddress,
            macAddress: randomMACAddress,
            country: randomCountry,
            phoneNumber: randomPhoneNumber,
            city: randomCity,
            streetAddress: randomStreetAddress,
            domain: randomDomain,
            creditCard: randomCreditCard || "Deleted",
            creditCardType: Capitalize(randomCreditCardType || "Deleted"),
            creditCardExpireDate: randomCreditCardExpireDate || "Deleted",
            creditCardCVV: randomCreditCardCVV || "Deleted",
            bitcoinAdress: randomBitcoinAdress || "Deleted",
            ethereumAdress: RandomEthereumAdress || "Deleted"
        })
    }

    return data;
}

interface CommandOptions {
    name: string;
    description?: string;
    aliases?: string[] | null;
    usage?: string;
    cooldown?: number;
    premiumCooldown?: number;
    type?: CommandTypes;
    botPermissions?: bigint[];
    userPermissions?: bigint[];
    examples?: string[];
    ownerOnly?: boolean;
    disabled?: boolean;
    nsfw?: boolean;
    premiumOnly?: boolean;
    run: (message: Message, args: string[], client: Bot, lang: string) => Promise<void | Message> | void | Message;
}
export default { CommandTypes, CommandsErrorTypes, Capitalize, getMemberAvatar, upload, getMemberFromMention, getUserBanner, sendErrorEmbed, createTempFile, writeToFile, deleteFile, getRange, capitalize, chatBot, generateRandomUserData }
export { CommandTypes, CommandsErrorTypes, CommandOptions }