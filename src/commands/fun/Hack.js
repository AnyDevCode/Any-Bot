const Command = require('../Command.js');
const {MessageEmbed} = require('discord.js');
const data = require('../../../data/fake_data.json');

module.exports = class HackCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'hack',
            usage: 'hack [mention/id]',
            description: 'Hacks a user. (Fake)',
            usages: [
                'hack @MDC',
                'hack 123456789'
            ],
            type: client.types.FUN
        });
    }

    async run(message, args) {
        const member = this.getMemberFromMention(message, args[0]) ||
            message.guild.members.cache.get(args[0]) ||
            message.member;

        let random = Math.floor(Math.random() * data.length);

        let first_name = data[random].first_name;
        let last_name = data[random].last_name;
        let email = data[random].email;
        let password = data[random].password;
        let gender = data[random].gender;
        let ip_address = data[random].ip_address;
        let mac_address = data[random].mac_address;
        let country = data[random].country;
        let phone = data[random].phone;
        let city = data[random].city;
        let street_address = data[random].street_address;
        let credit_card = data[random].credit_card || "DELETED";
        let credit_card_type = data[random].credit_card_type || "DELETED";
        let credit_card_expiration = data[random].credit_card_expiration || "DELETED - DELETED";
        let credit_card_cvv = data[random].credit_card_cvv || "DELETED";
        let bitcoin_address = data[random].bitcoin_address || "DELETED";
        let ethereum_address = data[random].ethereum_address || "DELETED";
        let domain = data[random].domain;

        let credit_card_expiration_year = credit_card_expiration.split('-')[0];
        let credit_card_expiration_month = credit_card_expiration.split('-')[1];

        let embed = new MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setAuthor(`${message.member.displayName} hacked ${member.displayName}`, message.author.displayAvatarURL())
            .setDescription("Looking for Data...")

        let msg = await message.channel.send(embed);

        let embed2 = new MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setAuthor(`${message.member.displayName} hacked ${member.displayName}`, message.author.displayAvatarURL())
            .setDescription(`Decrypting Data...`)

        await new Promise(resolve => setTimeout(resolve, 2000));

        await msg.edit(embed2);

        let final_embed = new MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setAuthor(`Hacked ${member.user.tag}`, member.user.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL())
            .addField('First Name', first_name, true)
            .addField('Last Name', last_name, true)
            .addField('Email', email, true)
            .addField('Password', password, true)
            .addField('Gender', gender, true)
            .addField("IP", ip_address, true)
            .addField("Mac Address", mac_address, true)
            .addField("Country", country, true)
            .addField("Phone", phone, true)
            .addField("City", city, true)
            .addField("Street Address", street_address, true)
            .addField("Credit Card", credit_card, true)
            .addField("Credit Card Type", credit_card_type, true)
            .addField("Credit Card Expiration", `${credit_card_expiration_year}/${credit_card_expiration_month}`, true)
            .addField("Credit Card CVV", credit_card_cvv, true)
            .addField("Bitcoin Address", bitcoin_address, true)
            .addField("Ethereum Address", ethereum_address, true)
            .addField("Data taken from", domain, true);

        await new Promise(resolve => setTimeout(resolve, 4000));

        await msg.edit(final_embed);

    }
}
