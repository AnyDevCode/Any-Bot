const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const math = require("math-expression-evaluator")
const { stripIndent } = require('common-tags');

module.exports = class DogFactCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'math',
      aliases: ['calc'],
      usage: 'math 1+1, math 2*5',
      description: stripIndent`
      It shows you the result of a mathematical operation.

      \`\`\`
      Mathematical Operations:
      + Addition
      - Subtraction
      * Multiplication
      / Division
      Sigma Summation
      Pi Product
      n Variable for Sunnation or Product
      pi Variable for Pi
      e Variable for Euler's Number
      Mod Modulus
      ^ Exponentiation
      ! Factorial
      C Combination
      P Permutation
      log Logarithm
      ln Natural Logarithm
      pow Power
      root Underroot
      sin Sine
      cos Cosine
      tan Tangent
      asin Inverse Sine
      acos Inverse Cosine
      atan Inverse Tangent
      sinh Hyperbolic Sine
      cosh Hyperbolic Cosine
      tanh Hyperbolic Tangent
      asinh Inverse Hyperbolic Sine
      acosh Inverse Hyperbolic Cosine
      atanh Inverse Hyperbolic Tangent
      \`\`\`
      `,
      type: client.types.FUN
    });
  }
  async run(message, args) {
    const mathembed = new MessageEmbed()
  
  if (!args[0]) {
    mathembed.setFooter("Please enter an `expression`");
    return await message.channel.send(mathembed); // Devuelve un mensaje si es que ejecuta el comando sin nada
  }
  let resultado;
  try {
    resultado = math.eval(args.join(" ")); // Make operation with args
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
