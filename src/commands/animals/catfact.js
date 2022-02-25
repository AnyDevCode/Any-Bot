const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class CatFactCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'catfact',
      aliases: ['cf'],
      usage: 'catfact',
      description: 'Says a random cat fact.',
      type: client.types.ANIMALS
    });
  }
  async run(message) {
    try {
      const res = await fetch('https://catfact.ninja/fact');
      const fact = (await res.json()).fact;
      const embed = new MessageEmbed()
        .setTitle('🐱  Cat Fact  🐱')
        .setDescription(fact)
        .setFooter({
          text: message.member.displayName,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })   
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send({embeds:[embed]});
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 1, 'Please try again in a few seconds', "The Api is down");
    }
  }
};
