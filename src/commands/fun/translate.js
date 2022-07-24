// noinspection GrazieInspection

const Command = require("../Command.js");
require("node-fetch");
const translate = require("node-google-translate-skidz");

module.exports = class TranslateCommand extends Command {
  constructor(client) {
    super(client, {
      name: "translate",
      aliases: ["trlt"],
      usage: "translate <Input language> <Output language> <Text to translate>",
      examples: [
        "translate es en Hola mundo",
        "translate en es Hello World",
        "translate ru en Hello Rusia",
      ],
      description: "Translate the text to the language you want",
      type: client.types.FUN,
    });
  }

  async run(message, args) {
    if (!args[2])
      return this.sendErrorMessage(
        message,
        0,
        `Please check the command and try again.`
      );

    try {
      translate(
        {
          text: args.slice(2).join(" "),
          source: args[0],
          target: args[1],
        },
        function (result) {
          if (result.translation.length > 2000) {
            for (let i = 0; i < result.translation.length; i += 2000) {
              message.channel.send({
                content: result.translation.substring(i, i + 2000),
              });
            }
          } else {
            message.channel.send({ content: result.translation });
          }
        }
      );
    } catch (err) {
      message.client.logger.error(err);
      await this.sendErrorMessage(
        message,
        1,
        "Please try again in a few seconds",
        err.message
      );
    }
  }
};
