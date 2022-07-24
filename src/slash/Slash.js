const { MessageEmbed } = require('discord.js');

/**
 * Any Bot's custom Command class
 */
class Slash {
  /**
   * Create new command
   * @param {Client} client
   * @param {Object} options
   */
  constructor(client, options) {
    /**
     * The client
     * @type {Client}
     */
    this.client = client;

    /**
     * Data
     * @type { Array }
     */
    this.data = options.data;

    /**
     * Name of the command
     * @type {string}
     */
    this.name = options.name;
  }

  /**
   * Runs the command
   * @param client
   * @param player
   * @param interaction
   * @param client
   * @param player
   */
  // eslint-disable-next-line no-unused-vars
  run(interaction, client, player) {
    throw new Error(`The ${this.name} command has no run() method`);
  }

  /**
   * Creates and sends mod log embed
   * @param {Message} message
   * @param {string} reason
   * @param {Object} fields
   */
  async sendModLogMessage(message, reason, fields = {}) {
    const modLogId = await message.client.mongodb.settings.selectModLogId(
      message.guild.id
    );
    const modLog = message.guild.channels.cache.get(modLogId);
    if (
      modLog &&
      modLog.viewable &&
      modLog
        .permissionsFor(message.guild.me)
        .has(["SEND_MESSAGES", "EMBED_LINKS"])
    ) {
      const caseNumber = await message.client.utils.getCaseNumber(
        message.client,
        message.guild,
        modLog
      );
      const embed = new MessageEmbed()
        .setTitle(`Action: \`${message.client.utils.capitalize(this.name)}\``)
        .addField("Moderator", `${message.member}`, true)
        .setFooter({ text: `Case #${caseNumber}` })
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      for (const field in fields) {
        embed.addField(`${field}`, `${fields[field]}`, true);
      }
      embed.addField("Reason", `${reason}`);
      modLog
        .send({ embeds: [embed] })
        .catch((err) => message.client.logger.error(err.stack));
    }
  }
}

module.exports = Slash;
