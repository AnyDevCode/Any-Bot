const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class TrumpTweetCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'trumptweet',
      aliases: ['trump'],
      usage: 'trumptweet <message>',
      description: 'Display\'s a custom tweet from Donald Trump with the message provided.',
      type: client.types.FUN,
      examples: ['trumptweet Any Bot is the best Discord Bot!']
    });
  }
  async run(message, args) {

    const { stringToUrlEncoded } = message.client.utils

    // Get message
    if (!args[0]) return await this.sendErrorMessage(message, 0, 'Please provide a message to tweet');
    let tweet = stringToUrlEncoded(args.join(' '));
    if (tweet.length > 68) tweet = tweet.slice(0, 65) + '...';

    try {
      const res = await fetch('https://nekobot.xyz/api/imagegen?type=trumptweet&text=' + tweet);
      const img = (await res.json()).message;
      const embed = new MessageEmbed()
        .setTitle(':flag_us:  Trump Tweet  :flag_us: ')
        .setImage(img)
        .setFooter({ text: message.member.displayName, icon_url: message.author.displayAvatarURL({ dynamic: true })})       
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send({embeds:[embed]});
    } catch (err) {
      message.client.logger.error(err.stack);
      await this.sendErrorMessage(message, 1, 'Please try again in a few seconds', err.message);
    }
  }
};
