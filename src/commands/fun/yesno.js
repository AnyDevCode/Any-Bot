const Command = require('../Command.js');
const {
  MessageEmbed
} = require('discord.js');
const axios = require("axios");

module.exports = class YesNoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'yesno',
      aliases: ['yn'],
      usage: 'yesno',
      description: 'Fetches a gif of a yes or a no.',
      type: client.types.FUN
    });
  }
  async run(message) {
    const res = await axios.get('https://yesno.wtf/api/')
      .then((res) => res.data)
      .catch((err) => {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, "Please try again in a few seconds", "The API is down");
      })
    let answer = message.client.utils.capitalize(res.answer);
    if (answer === 'Yes') answer = '👍  ' + answer + '!  👍';
    else if (answer === 'No') answer = '👎  ' + answer + '!  👎';
    else answer = '👍  ' + answer + '...  👎';
    const img = res.image;
    const embed = new MessageEmbed()
      .setTitle(answer)
      .setImage(img)
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
