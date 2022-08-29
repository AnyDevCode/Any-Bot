const Command = require('../Command.js');
const {
  MessageEmbed
} = require('discord.js');
const axios = require("axios");

module.exports = class MemeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'meme',
      usage: 'meme',
      description: 'Displays a random meme from the `memes`, `dankmemes`, or `me_irl` subreddits.',
      type: client.types.FUN
    });
  }
  async run(message) {
      let res = await axios.get("https://meme-api.herokuapp.com/gimme")
        .then((res) => res.data)
        .catch((err) => {
          message.client.logger.error(err.stack);
          return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
        });
      const embed = new MessageEmbed()
        .setTitle(res.title)
        .setImage(res.url)
        .setFooter({
          text: message.member.displayName,
          icon_url: message.author.displayAvatarURL({
            dynamic: true
          })
        })
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send({
        embeds: [embed]
      });
  }
};
