const Command = require('../Command.js');
const {MessageEmbed} = require('discord.js');
const axios = require('axios');
module.exports = class WeatherCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'weather',
            usage: 'weather <location>',
            description: 'Gets the weather for a location.',
            type: client.types.UTILS,
            examples: ['weather London', "weather Lima"]
        });
    }

    async run(message, args) {
        const {stringToUrlEncoded} = message.client.utils
        const apiKey = message.client.apiKeys.openweathermap
        const location = stringToUrlEncoded(args.join(' '));
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
        await axios.get(url).then(async res => {
            const data = res.data;
            const embed = new MessageEmbed()
                .setColor(message.guild ? message.guild.me.displayHexColor : '#7CFC00')
                .setTitle(`Weather for ${data.name}`)
                .setDescription(`${data.weather[0].description}`)
                .addField('Temperature', `${data.main.temp}°C`, true)
                .addField('Humidity', `${data.main.humidity}%`, true)
                .addField('Wind Speed', `${data.wind.speed} m/s`, true)
                .addField('Wind Direction', `${data.wind.deg}°`, true)
                .addField('Pressure', `${data.main.pressure} hPa`, true)
                .setThumbnail(`https://openweathermap.org/img/w/${data.weather[0].icon}.png`)
                .setTimestamp()
                .setFooter({ text: message.member.displayName, icon_url: message.author.displayAvatarURL({ dynamic: true })})       
                message.channel.send({embeds:[embed]});
        }).catch(() => {
            message.reply(`I couldn't find that location.`);
        });
    }
};

