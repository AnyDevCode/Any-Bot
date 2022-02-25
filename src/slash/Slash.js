const { MessageEmbed } = require('discord.js');
const permissions = require('../utils/permissions.json');
const { fail } = require('../utils/emojis.json');

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
    this.data = options.data

    /**
     * Name of the command
     * @type {string}
     */
    this.name = options.name;
  }

  /**
   * Runs the command
   * @param {Message} message
   * @param {string[]} args
   */
  // eslint-disable-next-line no-unused-vars
  run(interaction) {
    throw new Error(`The ${this.name} command has no run() method`);
  }
}

module.exports = Slash;
