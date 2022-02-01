const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');


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
      .setThumbnail('https://cdn.glitch.com/5bfb504c-974f-4460-ab6e-066acc7e4fa6%2Fezgif.com-gif-to-apng.png?v=1595260265531')
      .setDescription(`
        Click [here](https://github.com/sabattle/CalypsoBot) to go to the original repository from which Any Bot was created (Calypso Bot)!
        Click [here](https://github.com/MDCYT/Any-Bot) to go to the Any Bot repository!
        Please support me by starring ⭐ the repo, and feel free to comment about issues or suggestions!
      `)
      .addField('Other Links',
        '**[Invite Me](https://discordapp.com/oauth2/authorize?client_id=733728002910715977&scope=bot&permissions=8) | ' +
        '[Support Server](https://discord.gg/2FRpkNr)**'
      )
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
