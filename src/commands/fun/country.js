const Command = require('../Command.js');
const axios = require('axios');
const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const { abbreviateNumber } = require("js-abbreviation-number");

module.exports = class CountryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'country',
            usage: 'country [country]',
            description: 'Get information about a country.',
            cooldown: 500,
            type: client.types.FUN
        });
    }

    async run(message, args) {

        const {stringToUrlEncoded} = message.client.utils

        let country = stringToUrlEncoded(args.join(' '));
        if (!country) return this.sendErrorMessage(message, 0, 'You must provide a country.');
        let url = `https://restcountries.com/v3.1/name/${country}`;
        await axios.get(url).then(res => {
            let data = res.data[0];
            let embed = new MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setAuthor({
                    name: data.name.common,
                    iconURL: data.flags.png
                })
                .setThumbnail(data.flags.png)
                .addField('Capital', data.capital[0], true)
                .addField('Region', data.region, true)
                .addField('Subregion', data.subregion, true)
                .addField('Population', `${abbreviateNumber(data.population)}`, true)
                .addField('Area', `${abbreviateNumber(data.area)} km²`, true)
                .addField('Timezone', data.timezones[0], true)
                .addField('Calling Code', `${data.idd.root}${(data.idd.suffixes[0] ? data.idd.suffixes[0] : '')}`, true)
                .addField('Numeric Code', data.ccn3, true)
                .addField('Top Level Domain', data.tld[0], true)
                .addField('Alpha Code', data.cca2, true)
                .addField('Alpha 3 Code', data.cca3, true)
                .addField('Alt Spellings', data.altSpellings.join(', '), true)
                .addField('Borders', data.borders.join(', '), true)
                .addField('Latitude', `${data.latlng[0]}`, true)
                .addField('Longitude', `${data.latlng[1]}`, true)
                .addField('Demonym', data.demonyms.eng.m, true)

        const linkrow = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setURL(data.maps.googleMaps)
                .setLabel("Google Maps")
                .setStyle("LINK")
                .setEmoji("🗺"),
            )
            return message.channel.send({embeds: [embed], components: [linkrow]})
        }).catch(async () => {
            return this.sendErrorMessage(message, 1, 'Could not find that country.');
        });

    }
}
