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
    if (!code) return await this.sendErrorMessage(message, 0, 'Please provide code to eval');
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


      if (String(code).includes(message.client.token)) {
        message.delete()
        return message.channel.send("WOW, THIS IS MY FUCKING TOKEN, YOU LITTLE SHITTY BITCH\n https://media.discordapp.net/attachments/949096817650434090/965844199704522752/Any_Bot_Hold_Up.jpg?width=636&height=479")
      }

      let newCode = code

      if (originalCode.includes("--silent")) return;

      const embed = new MessageEmbed();

      try {
        code = await eval(code)
        code = inspect(code, { depth: 0 })

        if (String(code).includes(message.client.token)) {
          let embed = new MessageEmbed()
            .setTitle("WOW, THIS IS MY FUCKING TOKEN, YOU LITTLE SHITTY BITCH")
            .setImage("https://media.discordapp.net/attachments/949096817650434090/965844199704522752/Any_Bot_Hold_Up.jpg?width=636&height=479")
            .setColor("#ff0000")
            .setFooter({
              text: `${message.member.displayName} i think you are a fucking idiot`,
            })
            .setTimestamp()

          return message.channel.send({embeds: [embed]})
        }


        embed
          .addField('Input', `\`\`\`js\n${newCode.length > 1024 ? 'Too large to display.' : newCode}\`\`\``)
          .addField('Output', `\`\`\`js\n${code.length > 1024 ? 'Too large to display.' : code}\`\`\``)
          .setColor('#66FF00');

      } catch(err) {
        embed
          .addField('Input', `\`\`\`js\n${newCode.length > 1024 ? 'Too large to display.' : newCode}\`\`\``)
          .addField('Output', `\`\`\`js\n${err.length > 1024 ? 'Too large to display.' : err}\`\`\``)
          .setColor('#FF0000');
      }

      await message.reply({embeds: [embed], components: [row]});

    } else {
      await message.reply('(╯°□°)╯︵ ┻━┻ MY token. **MINE**.');
    }
  }
};
