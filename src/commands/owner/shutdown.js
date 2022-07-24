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
  async run(message) {
    const embed = new MessageEmbed()
        .setTitle('Shutdown...')
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      await message.channel.send({embeds: [embed]});
      //Ejecute the "under_construction" js file
      const under_construction = require(__basedir + '/data/under_contruction.js');
      message.client.destroy();
      await under_construction.run();
  }
};
