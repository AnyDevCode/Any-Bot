const Command = require('../Command.js');
const axios = require('axios');
const {
    MessageEmbed
} = require('discord.js');

module.exports = class CoronaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'corona',
            aliases: ['cv', 'covid'],
            usage: 'corona [country]',
            description: 'Says those infected with Corona in the world.',
            type: client.types.FUN,
            examples: ['corona', 'corona USA'],
        });
    }
    async run(message, args) {
        let text = args.join(" ");
        const baseUrl = "https://disease.sh/v3/covid-19";

        let url, corona;

        try {
            url = text[0] ? `${baseUrl}/countries/${text.replace(new RegExp(",", "g"), "%20")}` : `${baseUrl}/all`
            corona = await axios.get(url).then(res => res.data);
        } catch (error) {
            return message.channel.send({
                content: `***${text}*** does not exist, or there is no data on the selected country.`
            })
        }

        const embed = new MessageEmbed()
            .setTitle(args[0] ? `Stats ${text.toUpperCase()}` : 'Total Corona cases in the world')
            .setColor(message.guild.me.displayHexColor)
            .setThumbnail(args[0] ? corona.countryInfo.flag : 'https://i.giphy.com/YPbrUhP9Ryhgi2psz3.gif')
            .addFields({
                name: 'Total Cases:',
                value: corona.cases.toLocaleString(),
                inline: true
            }, {
                name: 'Total Deaths:',
                value: corona.deaths.toLocaleString(),
                inline: true
            }, {
                name: 'Total Recovered:',
                value: corona.recovered.toLocaleString(),
                inline: true
            }, {
                name: 'Active Cases:',
                value: corona.active.toLocaleString(),
                inline: true
            }, {
                name: 'Total Tests:',
                value: corona.tests.toLocaleString(),
                inline: true
            }, {
                name: 'Critical Cases:',
                value: corona.critical.toLocaleString(),
                inline: true
            }, {
                name: 'New Recovered Today:',
                value: corona.todayRecovered.toLocaleString().replace("-", ""),
                inline: true
            }, {
                name: 'New Cases Today:',
                value: corona.todayCases.toLocaleString().replace("-", ""),
                inline: true
            }, {
                name: 'New Deaths Today:',
                value: corona.todayDeaths.toLocaleString(),
                inline: true
            })

        await message.channel.send({
            embeds: [embed]
        })
    }
}
