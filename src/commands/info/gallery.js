const Command = require('../Command.js');
const ReactionMenu = require('../ReactionMenu.js');
const { MessageEmbed } = require('discord.js');
const art = [
  'https://cdn.glitch.me/5bfb504c-974f-4460-ab6e-066acc7e4fa6%2FAnybot%20profile%20picture.png?v=1634309691650',
  'https://cdn.glitch.me/5bfb504c-974f-4460-ab6e-066acc7e4fa6%2FAnybot%20Spooky%20Month.png?v=1634309692618',
  'https://cdn.glitch.me/5bfb504c-974f-4460-ab6e-066acc7e4fa6%2FAnybot%20triste.png?v=1634309695473',
  'https://cdn.glitch.me/5bfb504c-974f-4460-ab6e-066acc7e4fa6%2FAnybot%20404.png?v=1634309686116',
  'https://cdn.glitch.me/5bfb504c-974f-4460-ab6e-066acc7e4fa6%2FAnybot%20April%20Fools.png?v=1634309687963',
  'https://cdn.glitch.me/5bfb504c-974f-4460-ab6e-066acc7e4fa6%2FTrio%20Bots.png?v=1634309699674',
  "https://media.discordapp.net/attachments/863052640069484603/903834904163397642/71_sin_titulo_20211029233703.png?width=834&height=480",
  "https://cdn.glitch.me/5bfb504c-974f-4460-ab6e-066acc7e4fa6%2FAny%20Bot%20Maid.png?v=1636763012870"
];
const art_message = ["Hello, I'm Any Bot", "Spooky Month", "I'm so sad", "Well, I don't work today", "Jeje Nice", "Me with the boys", "I am Any Bot (By: Caterd#2560)", "Sus :flushed: (By: ChocoMilk#3255)"];

module.exports = class GalleryCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'gallery',
      aliases: ['art'],
      usage: 'gallery',
      description: 'Displays a gallery of Any Bot\'s art.',
      type: client.types.INFO,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS']
    });
  }
  run(message) {
    let n = 0;
    const embed = new MessageEmbed()
      .setTitle('Art Gallery')
      .setDescription(art_message[n])
      .setImage(art[n])
      .setFooter({
        text: 'Expires after three minutes.\n' + message.member.displayName,  
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })

      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    const json = embed.toJSON();
    const previous = () => {
      (n <= 0) ? n = art.length - 1 : n--;
      return new MessageEmbed(json).setImage(art[n]).setDescription(art_message[n]);
    };
    const next = () => {
      (n >= art.length - 1) ? n = 0 : n++;
      return new MessageEmbed(json).setImage(art[n]).setDescription(art_message[n]);
    };

    const reactions = {
      '◀️': previous,
      '▶️': next,
      '⏹️': null,
    };

    const menu = new ReactionMenu(
      message.client,
      message.channel,
      message.member,
      embed,
      null,
      null,
      reactions,
      180000
    );

    menu.reactions['⏹️'] = menu.stop.bind(menu);

  }
};
