const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const math = require("math-expression-evaluator")
const Discord = require('discord.js')

module.exports = class DogFactCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'math',
      aliases: ['calc'],
      usage: 'math 1+1, math 2*5',
      description: 'It shows you the result of a mathematical operation.',
      type: client.types.FUN
    });
  }
  async run(message, args) {
    const mathembed = new Discord.MessageEmbed()
  
  if (!args[0]) {
    mathembed.setFooter("Please enter an `expression`");
    return await message.channel.send(mathembed); // Devuelve un mensaje si es que ejecuta el comando sin nada
  }
  let resultado;
  try {
    resultado = math.eval(args.join(" ")); // El Args toma el calculo
  } catch (e) {
    resultado = "Error: Invalid Entry"; // Cuando es incorrecta
  }
  mathembed.addField("Input:", `\`\`\`js\n${args.join(" ")}\`\`\``, false) // Te da el calculo
  .setColor(message.guild.me.displayHexColor)
  .setTitle("📊 Calculator")
  .addField("Output:", `\`\`\`js\n${resultado}\`\`\``, false);
  await message.channel.send(mathembed);
  }
};
