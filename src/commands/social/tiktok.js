const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const tiktokScraper = require("tiktok-scraper");
const { abbreviateNumber } = require("js-abbreviation-number");

const options = {

  // Set session: {string[] default: ['']}
  // Authenticated session cookie value is required to scrape user/trending/music/hashtag feed
  // You can put here any number of sessions, each request will select random session from the list
  // Switch main host to Tiktok test enpoint.
  // When your requests are blocked by captcha you can try to use Tiktok test endpoints.
  useTestEndpoints: false
};

module.exports = class TikTokCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tiktok',
      usage: 'tiktok <username>',
      description: 'Tiktok Profile.',
      type: client.types.SOCIAL,
      examples: ['tiktok mdcdev', 'tiktok @mdcdev'],
      disabled: true
    });
  }
  async run(message, args) {


    const username = args.join(' ').replace(/[^a-zA-Z0-9 ]/g, "");

    try {
        const user = await tiktokScraper.getUserProfileInfo(username, options);
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
            .setAuthor({
                name: user.user.nickname,
                url: url,
                iconURL: user.user.avatarLarger
            })
            .setTitle("Tiktok User: " + user.user.nickname + " " + verifiedandprivateuser)
            .setDescription(user.user.signature)
            .addField("Hearts:",`${abbreviateNumber(user.stats.heartCount)} ❤️`, true)
            .addField("Followers:",`${abbreviateNumber(user.stats.followerCount)} 🧑‍🤝‍🧑`, true)
            .addField("Videos:",`${abbreviateNumber(user.stats.videoCount)} 📽️`, true)
            .setColor(message.guild.me.displayHexColor)
            .setTimestamp();
          
        await message.reply({embeds: [embed]});
    } catch (error) {
        await this.sendErrorMessage(message, 0, 'Please use a valid username');
    }

  }
};
