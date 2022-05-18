const Command = require('../Command.js');
const { MessageEmbed, version, MessageActionRow, MessageButton } = require('discord.js');
const pkg = require(__basedir + '/package.json');
const { owner } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class BotInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      aliases: ['bot', 'bi'],
      usage: 'botinfo',
      description: 'Fetches Any Bot\'s bot information.',
      type: client.types.INFO
    });
  }
  async run(message) {
    const botOwner = message.client.users.cache.get(message.client.ownerID).username + '#' + message.client.users.cache.get(message.client.ownerID).discriminator
    const prefix = await message.client.mongodb.settings.selectPrefix(message.guild.id);
    const tech = stripIndent`
      Version     :: ${pkg.version}
      Library     :: Discord.js v${version}
      Environment :: Node.js v12.16.3
      Database    :: SQLite
      Shards      :: ${message.client.shard ? `${message.client.shard.count}` : 'No Shards'}
    `;
    //Check the shard id and count
    const embed = new MessageEmbed()
        .setTitle(`${message.client.user.username}\'s Bot Information`)
        .setDescription(oneLine`
        ${message.client.user.username}\'s is a Discord bot that comes from a variation of another open source and fully customizable bot that is constantly growing.
        She comes packaged with a variety of commands and 
        a multitude of settings that can be tailored to your server's specific needs. 
        Her codebase also serves as a base framework to easily create Discord bots of all kinds.
        She first went live on **April 05nd, 2020**.
      `)
        .addField('Prefix', `\`${prefix}\``, true)
        .addField('Client ID', `\`${message.client.user.id}\``, true)
        .addField(`Developer ${owner}`, botOwner, true)
        .addField('Tech', `\`\`\`asciidoc\n${tech}\`\`\``)
        .addField(
            '**Links**',
            `**[Invite Me](https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot%20applications.commands&permissions=8) | ` +
            `[Support Server](${message.client.supportServerInvite}) **`
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
      .setLabel('Invite Me')
      .setStyle('LINK')
      .setURL(`https://discordapp.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot%20applications.commands&permissions=8`)
      .setEmoji('🔗'),
      new MessageButton()
      .setLabel('Support Server')
      .setStyle('LINK')
      .setURL(message.client.supportServerInvite)
      .setEmoji('🛠️')
    );

    message.channel.send({embeds: [embed], components: [linkrow]})
  }
};
