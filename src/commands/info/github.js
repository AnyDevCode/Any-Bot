const Command = require('../Command.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');


module.exports = class GitHubCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'github',
      aliases: ['gh', 'repo'],
      usage: 'github',
      description: 'Displays the link to Any Bot\'s GitHub repository.',
      type: client.types.INFO
    });
  }
  run(message) {
    const embed = new MessageEmbed()
      .setTitle('GitHub Link')
      .setThumbnail(message.client.user.displayAvatarURL({dynamic: true, size: 1024}))
      .setDescription(`
        Click [here](https://github.com/sabattle/CalypsoBot) to go to the original repository from which Any Bot was created (Calypso Bot)!
        Click [here](https://github.com/MDCYT/Any-Bot) to go to the Any Bot repository!
        Please support me by starring ⭐ the repo, and feel free to comment about issues or suggestions!
      `)
      .addField('Other Links',
          `**[Invite Me](https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot%20applications.commands&permissions=8) | ` +
        `[Support Server](${message.client.supportServerInvite})**`
      )
      .setFooter({
        text: message.member.displayName,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    const linkrow = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setLabel("Github")
        .setStyle("LINK")
        .setURL("https://github.com/MDCYT/Any-Bot")
        .setEmoji("⭐"),
      new MessageButton()
        .setLabel("Invite Me")
        .setStyle("LINK")
        .setURL(`https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot%20applications.commands&permissions=8`)
        .setEmoji("🔗"),
      new MessageButton()
        .setLabel("Support Server")
        .setStyle("LINK")
        .setURL(message.client.supportServerInvite)
        .setEmoji("🛡")
    );
    message.channel.send({embeds:[embed], components: [linkrow]});
  }
};
