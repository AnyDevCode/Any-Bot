const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const axios = require('axios')

module.exports = class DogFactCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'instagram',
      aliases: ['ig'],
      usage: 'instagram mdc',
      description: 'It tells you the info of an instagram account.',
      type: client.types.FUN
    });
  }
  async run(message, args) {
        if (!args[0]) {
            return message.channel.send(`Please put some account`)
        }
        let url, response, account, details;
        try {
            url = `https://instagram.com/${args[0]}/?__a=1`;
            response = await axios.get(url)
            account = response.data
            details = account.graphql.user
        } catch (error) {
            return message.channel.send(`No account was found called ${args[0]}`)
        }

        const embed = new MessageEmbed()
            .setTitle(`${details.is_verified ? `${details.username} <a:averify:761274029231177798>` : ` ${details.username}`} ${details.is_private ? '🔒' : ''} `)
            .setDescription(details.biography)
            .setThumbnail(details.profile_pic_url)
			.setColor(message.guild.me.displayHexColor)
            .addFields(
               {
                    name: "Full name:",
                    value: details.full_name.toLocaleString(),
                    inline: true
                },
                {
                    name: "Post Totals:",
                    value: details.edge_owner_to_timeline_media.count.toLocaleString(),
                    inline: true
                },
                {
                    name: "Followers:",
                    value: details.edge_followed_by.count.toLocaleString(),
                    inline: true
                },
                {
                    name: "Following:",
                    value: details.edge_follow.count.toLocaleString(),
                    inline: true
                }
            )
        await message.channel.send(embed)
  }
};
