const Command = require('../Command.js');
const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const { inspect } = require('util')

module.exports = class EvalCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      usage: 'eval <code>',
      description: 'Executes the provided code and shows output.',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['eval 1 + 1']
    });
  }
  async run(message, args) {

    let code = args.join(' ');
    if (!code) return this.sendErrorMessage(message, 0, 'Please provide code to eval');
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('evalbtn')
                .setLabel('Delete Output')
                .setStyle('DANGER'),
        )
    if(!code.toLowerCase().includes('token')) {
      const originalCode = code

      if (originalCode.includes("--str")) code = `${code.replace("--str", "").trim()}.toString()`
      if (originalCode.includes("--send")) code = `message.channel.send(${code.replace("--send", "").trim()})`
      if (originalCode.includes("--async")) code = `(async () => {${code.replace("--async", "").trim()}})()`
      code = code.replace("--silent", "").trim()


      if (String(code).includes(message.client.token)) code = "This message contained client's token."

      if (originalCode.includes("--silent")) return;

      const embed = new MessageEmbed();

      try {
        code = await eval(code)
        code = inspect(code, { depth: 0 })

        embed
          .addField('Input', `\`\`\`js\n${originalCode.length > 1024 ? 'Too large to display.' : originalCode}\`\`\``)
          .addField('Output', `\`\`\`js\n${code.length > 1024 ? 'Too large to display.' : code}\`\`\``)
          .setColor('#66FF00');

      } catch(err) {
        embed
          .addField('Input', `\`\`\`js\n${originalCode.length > 1024 ? 'Too large to display.' : originalCode}\`\`\``)
          .addField('Output', `\`\`\`js\n${err.length > 1024 ? 'Too large to display.' : err}\`\`\``)
          .setColor('#FF0000');
      }

      await message.reply({embeds: [embed], components: [row]});

    } else {
      await message.reply('(╯°□°)╯︵ ┻━┻ MY token. **MINE**.');
    }
  }
};
