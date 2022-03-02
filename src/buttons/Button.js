const { MessageEmbed } = require('discord.js');

/**
 * Any Bot's custom Button class
 */
class Button {

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
    this.data = options.data

    /**
     * Name of the command
     * @type {string}
     */
    this.name = options.name;

    /**
     * Is owner only
     * @type {boolean}
     */
    this.ownerOnly = options.ownerOnly || false;
  }

  /**
   * Runs the command
   * @param interaction
   */
  // eslint-disable-next-line no-unused-vars
  run(interaction) {
    throw new Error(`The ${this.name} command has no run() method`);
  }
}

module.exports = Button;
