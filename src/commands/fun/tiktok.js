const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
var tiktokScraper = require("tiktok-scraper")
const { abbreviateNumber } = require("js-abbreviation-number");

module.exports = class TikTokYoutubeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tiktok',
      usage: 'tiktok <username>',
      description: 'Tiktok Profile.',
      type: client.types.FUN,
      examples: ['tiktok mdcdev', 'tiktok @mdcdev'],
      disabled: false
    });
  }
  async run(message, args) {

    const username = args.join(' ').replace(/[^a-zA-Z ]/g, "");

    try {
        const user = await tiktokScraper.getUserProfileInfo(username);
        const verifiedandprivateuser = `${user.user.verified ? "<a:averify:761274029231177798>" : ""} ${user.user.privateAccount ? "🔒" : ""}`
        const { formatUrl } = message.client.utils;
        const protocol = 'https';
        const hostname = 'tiktok.com';
        const pathname = '/@' + user.user.uniqueId;
        const url = formatUrl({
          hostname,
          pathname, // pathname will have "/" prepended if absent
          protocol, // protocol actually ends in ":", but this will also be fixed for you
        });
        const embed = new MessageEmbed()
            .setAuthor(user.user.nickname, user.user.avatarLarger, url)
            .setTitle("Tiktok User: " + user.user.nickname + " " + verifiedandprivateuser)
            .setDescription(user.user.signature)
            .addField("Hearts:",`${abbreviateNumber(user.stats.heartCount)} ❤️`, true)
            .addField("Followers:",`${abbreviateNumber(user.stats.followerCount)} 🧑‍🤝‍🧑`, true)
            .addField("Videos:",`${abbreviateNumber(user.stats.videoCount)} 📽️`, true)
            .setColor(message.guild.me.displayHexColor)
            .setTimestamp();
          
        message.channel.send(embed) ;
    } catch (error) {
        this.sendErrorMessage(message, 0, 'Please use a valid username');
    }

  }
};
