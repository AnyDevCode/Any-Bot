const { verify } = require('../utils/emojis.json');
const { stripIndent } = require('common-tags');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "messageReactionRemove",
    async execute(messageReaction, user, commands, client) {
      if (client.user === user) return;

  const { message, emoji } = messageReaction;

  client.db.users.updateTotalReactionsMinus.run(message.author.id, message.guild.id);

  // Starboard
  if (emoji.name === '⭐' && message.author !== user) {
    const starboardChannelId = client.db.settings.selectStarboardChannelId.pluck().get(message.guild.id);
    const starboardChannel = message.guild.channels.cache.get(starboardChannelId);
    if (
      !starboardChannel || 
      !starboardChannel.viewable ||
      !starboardChannel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS']) ||
      message.channel === starboardChannel
    ) return;

    const emojis = ['⭐', '🌟', '✨', '💫', '☄️'];
    const messages = await starboardChannel.messages.fetch({ limit: 100 });

    const starred = messages.find(m => {
      return emojis.some(e => {
        return m.content.startsWith(e) &&
          m.embeds[0] &&
          m.embeds[0].footer &&
          m.embeds[0].footer.text === message.id;
      });
    });

    // If message already in starboard
    if (starred) {

      const starCount = parseInt(starred.content.split(' ')[1].slice(2)) - 1;

      // Determine emoji type
      let emojiType;
      if (starCount > 20) emojiType = emojis[4];
      else if (starCount > 15) emojiType = emojis[3];
      else if (starCount > 10) emojiType = emojis[2];
      else if (starCount > 5) emojiType = emojis[1];
      else emojiType = emojis[0];

      const starMessage = await starboardChannel.messages.fetch(starred.id);
      await starMessage.edit({content: `${emojiType} **${starCount}  |**  ${message.channel}`});

      if (starCount === 0)
        await starMessage.delete().catch(err => client.logger.error(err.stack));
    }
  } 
    },
  };
  