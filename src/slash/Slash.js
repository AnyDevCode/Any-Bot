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
}

module.exports = Slash;
