const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class GetInviteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'getinvite',
      usage: 'getinvite [server ID]',
      description: 'Get the invite link for the specified server.',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['getinvite 709992782252474429'],
      info_only_for_developers: "This command is not used by anything of AnyBot Team, this command is only for test purposes."
    });
  }
  async run(message, args) {
    const guildId = args[0];
    if (!rgx.test(guildId))
      return await this.sendErrorMessage(message, 0, 'Please provide a valid server ID');
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return await this.sendErrorMessage(message, 0, 'Unable to find server, please check the provided ID');
    const invite = await guild.channels.cache.first().createInvite({
      maxAge: 1800,
      maxUses: 1,
      unique: true,
      reason: 'Requested by ' + message.author.tag
    });
    const embed = new MessageEmbed()
      .setTitle('Invite')
      .setDescription(`Here is the invite link for **${guild.name}**:`)
      .addField('Invite Link', invite.url)
      .setFooter(
        {
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        }
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({embeds: [embed]});
  } 
};
