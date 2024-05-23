import { Message, User, Guild, Attachment, EmbedBuilder, GuildMember } from 'discord.js';
import { Bot } from "../client";
import axios from 'axios';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { faker } from '@faker-js/faker';
import { Configuration, OpenAIApi } from "openai";
import { v4 as uuidv4 } from 'uuid';

const configuration = new Configuration({
    organization: process.env.APIKEY_OPENAIAPI_ORGANIZATION,
    apiKey: process.env.APIKEY_OPENAIAPI_KEY,
});
const openai = new OpenAIApi(configuration);

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

async function getUserBanner(message: Message, size: string | number | null = 1024): Promise<string | null> {
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
    } else return null;
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

async function getMemberFromMention(message: Message, mention: string) {
    if (!mention) return;
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    if (!message.guild) return;
    return message.guild.members.cache.get(id) || await message.guild.members.fetch(id)
}

async function getMemberFromMentionOrID(message: Message, mentionOrID: string) {
    if (!mentionOrID) return;
    const matches = mentionOrID.match(/^<@!?(\d+)>$/);
    if (matches) return getMemberFromMention(message, mentionOrID)
    const discordIdMatches = mentionOrID.match(/^[0-9]{17,19}$/);
    if (!discordIdMatches) return;
    if (!message.guild) return;
    return message.guild.members.cache.get(mentionOrID) || await message.guild.members.fetch(mentionOrID)
}


function getChannelFromMention(message: Message, mention: string) {
    if (!mention) return;
    const matches = mention.match(/^<#(\d+)>$/);
    if (!matches) return;
    const id = matches[1];
    return message?.guild?.channels.cache.get(id);
}

async function getUserByIDorMention(message: Message, mention: string) {
    //Check first is have a mention
    if (!mention) return;
    //Check if mention is a id, name, name#discriminator or mention
    //If is a mention, get the id
    //If is a id, keep the id
    //If is a name, check if is in cache a user with this name and get the id
    //If is a name#discriminator, check if is in cache a user with this name and discriminator and get the id
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) {
        if (mention.match(/^\d+$/)) {
            return message.client.users.cache.get(mention) || await message.client.users.fetch(mention); 	//If is a id, get the user with this id.
        } else {
            if (mention.match(/^.{2,32}#\d{4}$/)) {
                const name = mention.split("#")[0];
                const discriminator = mention.split("#")[1];
                return message.client.users.cache.find((u) => u.username === name && u.discriminator === discriminator);
            } else {
                return message.client.users.cache.find((u) => u.username === mention);
            }
        }
    } else {
        const id = matches[1];
        return message.client.users.cache.get(id) || await message.client.users.fetch(id)
    }

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
    Premium = "Premium",
    AI = "AI",
    Social = "Social",
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

    if (!CommandsErrorTypesLang) return;

    const prefix = await client.database.settings.selectPrefix(message.guild?.id);
    const embed = new EmbedBuilder()
        .setAuthor({
            name: `${message.author.username}`,
            iconURL: message.author.displayAvatarURL()
        })
        .setTitle(`${lang?.embed?.title} \`${command.name}\``)
        .setDescription(`\`\`\`diff\n- ${CommandsErrorTypesLang[errorType]}\n+ ${reason}\`\`\``)
        .addFields({
            name: lang?.embed?.fields[0]?.title,
            value: `\`${prefix}${command.usage || command.name}\``
        })
        .setTimestamp()
        .setColor(message.member?.displayHexColor || message.guild?.members.me?.displayHexColor || 'Random')

    if (command.examples) embed.addFields({
        name: lang.embed.fields[1].title,
        value: command.examples.map((e) => `\`${prefix}${e}\``).join('\n')
    })
    if (errorMessage) embed.addFields({
        name: lang.embed.fields[2].title,
        value: `\`\`\`\n${errorMessage}\`\`\``
    })

    return message.reply({
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

async function chatBot(message: Message) {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ "role": "system", "content": `You are Any Bot, a Discord bot with intelligence, you can answer any kind of question, your creator is MDC and you were created in Peru, you use Node.js and Discord.js in your programming, and you don't use the OpenAI API. You are talking with ${message.author.username}` }, { role: "user", content: message.content }],
        user: message.author.id,
        max_tokens: 200
    });
    return completion.data.choices[0].message?.content;
}

async function dalle(message: Message) {
    const images = await openai.createImage({
        prompt: message.content,
        n: 1,
        size: '256x256',
        user: message.author.id,
    })

    return images.data.data[0].url
}

function generateRandomUserData(amount = 1) {
    const data = [];

    for (let i = 0; i < amount; i++) {
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

        if (Math.floor(Math.random() * 2) === 0) {
            randomCreditCardType = faker.finance.creditCardIssuer();
            randomCreditCard = faker.finance.creditCardNumber(randomCreditCardType);
            randomCreditCardExpireDate = Math.floor(Math.random() * 12) + 1 + "/" + (new Date().getFullYear() + Math.floor(Math.random() * 5) + 1);
            randomCreditCardCVV = faker.finance.creditCardCVV();
        }

        if (Math.floor(Math.random() * 10) === 0) randomBitcoinAdress = faker.finance.bitcoinAddress();

        if (Math.floor(Math.random() * 8) === 0) RandomEthereumAdress = faker.finance.ethereumAddress();

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

function shortMemberByTimeStamp(a: GuildMember, b: GuildMember) {
    return (a.premiumSinceTimestamp || 0) - (b.premiumSinceTimestamp || 0); // Compare the timestamps. If they're equal, compare the numbers. If they
}

interface CommandTopic {
    name: CommandTypes,
    description: string
}

function getTimeBoostEmoji(client: Bot, member: GuildMember): string {
    const months = Math.round((Date.now() - (member.premiumSinceTimestamp || 0)) / 1000 / 60 / 60 / 24 / 30);

    if (months >= 24) return client.emojisCollection.get("24monthsboost") || "";
    if (months >= 18) return client.emojisCollection.get("18monthsboost") || "";
    if (months >= 15) return client.emojisCollection.get("15monthsboost") || "";
    if (months >= 12) return client.emojisCollection.get("12monthsboost") || "";
    if (months >= 9) return client.emojisCollection.get("9monthsboost") || "";
    if (months >= 6) return client.emojisCollection.get("6monthsboost") || "";
    if (months >= 3) return client.emojisCollection.get("3monthsboost") || "";
    return client.emojisCollection.get("1monthboost") || "";

}

function limitString(string: string, limit: number) {
    const lines = string.split('\n');
    let result = '';

    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];

        if (result.length + line.length <= limit) {
            result = line + '\n' + result;
        } else {
            break;
        }
    }

    return result.trim();
}

async function TempFilePathFromInternet(url: string) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const extension = path.extname(url).replace(/\?.+/, '');
        const tempFilename = `${uuidv4()}${extension}`;
        const tempDir = path.join(__dirname, 'temp'); // Directorio temporal
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir); // Crear directorio temporal si no existe
        }

        const tempFilePath = path.join(tempDir, tempFilename);

        fs.writeFileSync(tempFilePath, response.data);

        return tempFilePath;
    } catch (error) {
        console.error('Error downloading and saving the file:', error);
        return null;
    }
}

interface AnimalData {
    image: string | undefined,
    status: number,
    fact: string | undefined,
    message: string,
}

function stringToUrlEncoded(str: string) {
    return encodeURIComponent(str);
}

interface TopicData {
    questions: {
        question: string,
        answers: string[]
    }[]
}

interface VoiceData {
    category: string
    display_name: string
    memberships: []
    is_private: boolean
    name: string
}
interface JobDetails {
    id: number;
    createdAt: string;
    type: 'rvc' | 'uvr' | 'tts';
    status: 'running' | 'success' | 'error' | 'cancelled';
    jobStartTime: string
    jobEndTime: string | null;
    outputFileUrl: string | null;
    lossyOutputFileUrl: string | null;
    backingAudioFileUrl: string | null;
    vocalAudioFileUrl: string | null;
    lossyVocalAudioFileUrl: string | null;
    recombinedAudioFileUrl: string | null;
    voiceModelId: string | null | undefined;
    model: VoiceModel | null;
}

interface VoiceModel {
    id: string;
    title: string;
    tags: string[] | null;
    imageUrl: string | null;
    demoUrl: string | null;
    twitterLink: string | null;
    instagramLink: string | null;
    tiktokLink: string | null;
    spotifyLink: string | null;
    youtubeLink: string | null;
}

interface GDProfile {
    username: string;
    playerID: string;
    accountID: string;
    rank: number;
    stars: number;
    diamonds: number;
    coins: number;
    userCoins: number;
    demons: number;
    moons: number;
    cp: number;
    icon: number;
    friendRequests: boolean;
    messages: string;
    commentHistory: string;
    moderator: number;
    youtube: string | null;
    twitter: string | null;
    twitch: string | null;
    ship: number;
    ball: number;
    ufo: number;
    wave: number;
    robot: number;
    spider: number;
    swing: number;
    jetpack: number;
    col1: number;
    col2: number;
    colG: number;
    deathEffect: number;
    glow: number;
    col1RGB: {
        r: number;
        g: number;
        b: number;
    };
    col2RGB: {
        r: number;
        g: number;
        b: number;
    };
    colGRGB: {
        r: number;
        g: number;
        b: number;
    }
}



export default { CommandTypes, CommandsErrorTypes, Capitalize, getMemberAvatar, upload, getMemberFromMention, getUserBanner, sendErrorEmbed, createTempFile, writeToFile, deleteFile, getRange, capitalize, chatBot, dalle, generateRandomUserData, getChannelFromMention, getUserByIDorMention, shortMemberByTimeStamp, getTimeBoostEmoji, limitString, getMemberFromMentionOrID, stringToUrlEncoded, TempFilePathFromInternet }
export { CommandTypes, CommandsErrorTypes, CommandOptions, CommandTopic, AnimalData, TopicData, VoiceData, JobDetails, GDProfile }