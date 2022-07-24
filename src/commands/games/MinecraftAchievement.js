const Command = require("../Command.js");
const superagent = require("superagent");

module.exports = class MinecraftArchievementCommand extends Command {
  constructor(client) {
    super(client, {
      name: "mcachievement",
      aliases: ["mcam"],
      usage: "mcachievement <text>",
      description: "Turn your text into a Minecraft achievement.",
      type: client.types.GAMES,
    });
  }
  async run(message, args) {
    try {
      let text = args.join(" ");
      if (!text)
        return this.sendErrorMessage(message, 0, "Please enter a text.");
      if (text.length > 25)
        return this.sendErrorMessage(
          message,
          1,
          "Text must be 25 characters or less."
        );
      if (text.length < 2)
        return this.sendErrorMessage(
          message,
          1,
          "Text must be 2 characters or more."
        );

      // Random number in the range of 1 to 39
      let random = Math.floor(Math.random() * 39) + 1;

      let link =
        "https://www.minecraftskinstealer.com/achievement/a.php?i=" + random;

      const { body } = await superagent.get(link).query({
        h: "Achievement get!",
        t: text,
      });

      message.channel.send({
        files: [{ attachment: body, name: "Achievement.png" }],
      });
    } catch (e) {
      message.client.logger.error(e);
      return this.sendErrorMessage(message, 0, "An error occurred.");
    }
  }
};