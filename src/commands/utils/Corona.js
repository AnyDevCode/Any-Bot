const Command = require('../Command.js');
const axios = require('axios');
const {
    MessageEmbed
} = require('discord.js');
const fs = require('fs');
const yaml = require('js-yaml');
const {
    join
} = require('path');

module.exports = class CoronaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'corona',
            aliases: ['cv', 'covid'],
            usage: 'corona [country]',
            description: 'Says those infected with Corona in the world.',
            type: client.types.UTILS,
            examples: ['corona', 'corona USA'],
        });
    }
    async run(message, args) {
        const lang_text = yaml.load(fs.readFileSync(join(__basedir, 'data', 'lang', message.lang, 'commands', 'utils', 'Corona.yml'), 'utf8'))[message.lang];

        let text = args.join(" ");
        const baseUrl = "https://disease.sh/v3/covid-19";

        let url, corona;

        try {
            url = text[0] ? `${baseUrl}/countries/${text.replace(new RegExp(",", "g"), "%20")}` : `${baseUrl}/all`
            corona = await axios.get(url).then(res => res.data);
        } catch (error) {
            return message.channel.send({
                content: lang_text.errors.country_not_found.replace('%{country}', text),
            })
        }

        const embed = new MessageEmbed()
            .setTitle(args[0] ? lang_text.messages.one_country_stats.replace('%{country}', text.toUpperCase()) : lang_text.messages.all_countries_stats)
            .setColor(message.guild.me.displayHexColor)
            .setThumbnail(args[0] ? corona.countryInfo.flag : 'https://i.giphy.com/YPbrUhP9Ryhgi2psz3.gif')
            .addFields({
                name: lang_text.fields.total_cases,
                value: corona.cases.toLocaleString(),
                inline: true
            }, {
                name: lang_text.fields.total_deaths,
                value: corona.deaths.toLocaleString(),
                inline: true
            }, {
                name: lang_text.fields.total_recovered,
                value: corona.recovered.toLocaleString(),
                inline: true
            }, {
                name: lang_text.fields.active_cases,
                value: corona.active.toLocaleString(),
                inline: true
            }, {
                name: lang_text.fields.total_tests,
                value: corona.tests.toLocaleString(),
                inline: true
            }, {
                name: lang_text.fields.critical_cases,
                value: corona.critical.toLocaleString(),
                inline: true
            }, {
                name: lang_text.fields.new_recovered_today,
                value: corona.todayRecovered.toLocaleString().replace("-", ""),
                inline: true
            }, {
                name: lang_text.fields.new_cases_today,
                value: corona.todayCases.toLocaleString().replace("-", ""),
                inline: true
            }, {
                name: lang_text.fields.new_deaths_today,
                value: corona.todayDeaths.toLocaleString(),
                inline: true
            })

        await message.channel.send({
            embeds: [embed]
        })
    }
}
