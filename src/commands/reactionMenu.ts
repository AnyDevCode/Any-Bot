import { TextChannel, GuildMember, Embed, APIEmbed, EmbedBuilder, MessageReaction, User, APIActionRowComponent, APIMessageActionRowComponent, JSONEncodable, ActionRowData } from 'discord.js';
import { Bot as Client } from '../client';

/**
 * Any Bot's Reaction Menu class
 */
export class ReactionMenu {
  client: Client;
  channel: TextChannel;
  memberId: string;
  embed: Embed;
  arr: any[];
  interval: number;
  reactions: {
    [key: string]: () => () => EmbedBuilder | undefined | void;
  };
  timeout: number;
  extra?: {
    row?: APIActionRowComponent<APIMessageActionRowComponent> | JSONEncodable<APIActionRowComponent<APIMessageActionRowComponent>> | ActionRowData<any>;
  };
  json: APIEmbed;
  current: number;
  max: number;
  emojis: {};
  message: any;
  collector: any;

  /**
   * Create new ReactionMenu
   */
  constructor(
    client: Client,
    channel: TextChannel,
    member: GuildMember,
    embed: Embed,
    arr: any[] = [],
    interval: number = 10,
    reactions: {
      [key: string]: () => () => EmbedBuilder | undefined | void;
    } = {
        '⏪': () => this.first.bind(this),
        '◀️': () => this.previous.bind(this),
        '▶️': () => this.next.bind(this),
        '⏩': () => this.last.bind(this),
        '⏹️': () => this.stop.bind(this),
      },
    timeout: number = 120000,
    extra: {
      row?: APIActionRowComponent<APIMessageActionRowComponent> | JSONEncodable<APIActionRowComponent<APIMessageActionRowComponent>> | ActionRowData<any>;
    } = {},
  ) {
    /**
     * The Any Bot Client
     */
    this.client = client;

    /**
     * The text channel
     */
    this.channel = channel;

    /**
     * The member ID snowflake
     */
    this.memberId = member.id;

    /**
     * The embed passed to the Reaction Menu
     */
    this.embed = embed;

    /**
     * The extra passed to the Reaction Menu
     */
    this.extra = extra;

    /**
     * JSON from the embed
     */
    this.json = embed.toJSON();

    /**
     * The array passed to the Reaction Menu
     */
    this.arr = arr;

    /**
     * The interval passed to the Reaction Menu
     */
    this.interval = interval;

    /**
     * The current array window start
     */
    this.current = 0;

    /**
     * The max length of the array
     */
    this.max = (this.arr) ? arr.length : 0;

    /**
     * The reactions for menu
     */
    //If reactions have a empty function, then it will be replaced with the default function
    this.reactions = reactions;

    /**
     * The emojis used as keys
     */
    this.emojis = Object.values(this.reactions);


    /**
     * The collector timeout
     */
    this.timeout = timeout;

    const first = new EmbedBuilder(this.json);
    let description: any = (this.arr) ? this.arr.slice(this.current, this.interval) : null;
    description = (description) ? description.join('\n') : null;
    if (description) first
      .setTitle(this.embed.title + ' ' + this.client.utils.getRange(this.arr, this.current, this.interval))
      .setDescription(description);

    if (this.extra && this.extra?.row) {
      this.channel.send({ embeds: [first], components: [this.extra.row] }).then(message => {


        /**
         * The menu message
         * @type {Message}
       */
        this.message = message;

        (async () => {
          await this.addReactions();
          this.createCollector();
        })();
      });
      this.channel.send({ embeds: [first] }).then(message => {


        /**
         * The menu message
         * @type {Message}
       */
        this.message = message;

        (async () => {
          await this.addReactions();
          await this.createCollector();
        })();
      });

    }
  }

  /**
   * Adds reactions to the message
   */
  async addReactions() {
    // this.emojis is a object, so we need to convert it to an array
    const emojis = Object.values(this.emojis);
    for (const emoji of emojis) {
      await this.message.react(emoji);
    }
  }

  /**
   * Creates a reaction collector
   */
  createCollector() {
    const emojis = Object.values(this.emojis);
    // Create collector
    const collector = this.message.createReactionCollector((reaction: MessageReaction, user: User) => {
      return (emojis.includes(reaction.emoji.name) || emojis.includes(reaction.emoji.id)) &&
        user.id === this.memberId;
    }, { time: this.timeout });

    // On collect
    collector.on('collect', async (reaction: MessageReaction) => {
      let newPage = this.reactions[reaction.emoji.name || reaction.emoji.id || ""]();
      if (newPage) await this.message.edit({ embeds: [newPage] })
      await reaction.users.remove(this.memberId);
    });

    // On end
    collector.on('end', () => {
      this.message.reactions.removeAll();
    });

    this.collector = collector;
  }

  /**
   * Skips to the first array interval
   */
  first() {
    if (this.current === 0) return;
    this.current = 0;
    return new EmbedBuilder(this.json)
      .setTitle(this.embed.title + ' ' + this.client.utils.getRange(this.arr, this.current, this.interval))
      .setDescription((this.arr.slice(this.current, this.current + this.interval)).join('\n'));
  }

  /**
   * Goes back an array interval
   */
  previous() {
    if (this.current === 0) return;
    this.current -= this.interval;
    if (this.current < 0) this.current = 0;
    return new EmbedBuilder(this.json)
      .setTitle(this.embed.title + ' ' + this.client.utils.getRange(this.arr, this.current, this.interval))
      .setDescription((this.arr.slice(this.current, this.current + this.interval)).join('\n'));
  }

  /**
   * Goes to the next array interval
   */
  next() {
    const cap = this.max - (this.max % this.interval);
    if (this.current === cap || this.current + this.interval === this.max) return;
    this.current += this.interval;
    if (this.current >= this.max) this.current = cap;
    const max = (this.current + this.interval >= this.max) ? this.max : this.current + this.interval;
    return new EmbedBuilder(this.json)
      .setTitle(this.embed.title + ' ' + this.client.utils.getRange(this.arr, this.current, this.interval))
      .setDescription((this.arr.slice(this.current, max)).join('\n'));
  }

  /**
   * Goes to the last array interval
   */
  last() {
    const cap = this.max - (this.max % this.interval);
    if (this.current === cap || this.current + this.interval === this.max) return;
    this.current = cap;
    if (this.current === this.max) this.current -= this.interval;
    return new EmbedBuilder(this.json)
      .setTitle(this.embed.title + ' ' + this.client.utils.getRange(this.arr, this.current, this.interval))
      .setDescription((this.arr.slice(this.current, this.max)).join('\n'));
  }

  /**
   * Stops the collector
   */
  stop() {
    this.collector.stop();
  }
};