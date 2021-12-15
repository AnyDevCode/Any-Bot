const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const translate = require('node-google-translate-skidz');

module.exports = class TranslateCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'translate',
      aliases: ['trlt'],
      usage: 'translate <Input language> <Output language> <Text to translate>',
      examples: ["translate es en Hola mundo", "translate en es Hello World", "translate ru en Hello Rusia"],
      description: 'Translate the text to the language you want',
      type: client.types.FUN
    });
  }
  async run(message, args) {

    if(!args[2]) return this.sendErrorMessage(message, 0, `Please check the command and try again.`);

    try {
      translate({
        text: args.slice(2).join(" "),
        source: args[0], // Este es la fuente, es decir el idioma que queremos pasar a el idioma puesto en target, ya saben con codigo i18n.
        target: args[1] // El idioma en i18n al que queremos traducir
       }, function(result) {
        message.channel.send(result.translation) // Hacemos esto, corremos el codigo y ya sabran que devuelve para utilizarlo a su necesidad. ;)
      });
    } catch (err) {
      message.client.logger.error(err);
      this.sendErrorMessage(message, 1, 'Please try again in a few seconds', err.message);
    }
  }
};
