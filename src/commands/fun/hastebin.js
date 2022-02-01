const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const paste = require('hastebin-paste');

module.exports = class HasteBinCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'hastebin',
      usage: 'hastebin <extension> <text>',
      description: 'Save your text on the HasteBin page.',
      type: client.types.FUN
    });
  }
  async run(message, args) {

    let extensions = ["js", "json", "txt", "py", "md", "hx", "lua", "html", "css"]

    if (!args[0]) return this.sendErrorMessage(message, 0, 'Please specify an extension.');

    if (!extensions.includes(args[0].toLowerCase())) return this.sendErrorMessage(message, 0, `The extension is not valid`, `The extension is not valid, you should put the extension like these:\n${extensions.join(', ')}`)

    if (!args[1]) return this.sendErrorMessage(message, 0, 'Please specify the text.');

    let text = args.slice(1).join(" ")

    let embed = new MessageEmbed()
      .setTitle("Saving...")
      .setColor(message.guild.me.displayHexColor)
    message.channel.send(embed).then(msg => {
      paste(text, {extension: args[0].toLowerCase(), message: "", prefix: "The link is:"}).then(url => {
        embed.setTitle("Saved!")
        embed.setDescription(`The link is: ${url}`)
        embed.setColor(message.guild.me.displayHexColor)
        msg.edit(embed)
        console.log(url)
      }).catch(() => {
        this.sendErrorMessage(message, 1, "Error while saving")
      })
    })

  }
}
