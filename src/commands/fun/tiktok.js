const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
var tiktokScraper = require("tiktok-scraper")

module.exports = class TikTokYoutubeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tiktok',
      usage: 'tiktok <username>',
      description: 'Tiktok Profile.',
      type: client.types.FUN,
      examples: ['tiktok mdcdev', 'tiktok @mdcdev'],
      disabled: true
    });
  }
  async run(message, args) {

    const username = args.join(' ').replace(/[^a-zA-Z ]/g, "");

    try {
        const user = await tiktokScraper.getUserProfileInfo(username);
        const verifiedandprivateuser = `${user.user.verified ? "<a:averify:761274029231177798>" : ""} ${user.user.privateAccount ? "🔒" : ""}`
        const embed = new MessageEmbed()
            .setAuthor(user.user.nickname, user.user.avatarLarger)
            .setTitle("Tiktok User: " + user.user.nickname + " " + verifiedandprivateuser)
            .setDescription(user.user.signature)
            .addField("Hearts:",`${user.stats.heartCount} ❤️`, true)
            .addField("Followers:",`${user.stats.followerCount} 🧑‍🤝‍🧑`, true)
            .addField("Videos:",`${user.stats.videoCount} 📽️`, true)
            .setColor(message.guild.me.displayHexColor)
        //    .setURL("https://tiktok.com/@"+user)
            .setTimestamp();
            message.channel.send(embed) ;
      console.log(user)
    } catch (error) {
        this.sendErrorMessage(message, 0, 'Please use a valid username');
        console.log(error)
    }

  }
};
