const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class EvalCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shutdown',
      usage: 'shutdown',
      description: 'Shutdown the bot, because idk.',
      type: client.types.OWNER,
      ownerOnly: true
    });
  }
  async run(message, args) {
    const embed = new MessageEmbed()
      .setTitle('Shutdown...')
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);() => {

      }
      await message.channel.send(embed);
      process.exit(0)
  }
};
