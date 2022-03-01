const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "messageDelete",
  execute(message, commands, client) {
    if (message.author.bot) return;

    // Check for webhook and that message is not empty
    if (message.webhookID) return;

    const embed = new MessageEmbed()
      .setTitle("Message Update: `Delete`")
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Message delete

    if (message.embeds.length === 0) {
      // Dont send logs for starboard delete
      const starboardChannelId = client.db.settings.selectStarboardChannelId
        .pluck()
        .get(message.guild.id);
      const starboardChannel =
        message.guild.channels.cache.get(starboardChannelId);
      if (message.channel == starboardChannel) return;

      // Get message delete log
      const messageDeleteLogId = client.db.settings.selectMessageDeleteLogId
        .pluck()
        .get(message.guild.id);
      const messageDeleteLog =
        message.guild.channels.cache.get(messageDeleteLogId);
      if (
        messageDeleteLog &&
        messageDeleteLog.viewable &&
        messageDeleteLog
          .permissionsFor(message.guild.me)
          .has(["SEND_MESSAGES", "EMBED_LINKS"])
      ) {
        if (message.content) {
          if (message.content.length > 1024)
            message.content = message.content.slice(0, 1021) + "...";
        } else {
          message.content = "`Empty or Embed`";
        }

        let links

        if(message.attachments.size > 0) {
          links = message.attachments.map(a => a.proxyURL).join("\n")
          if(links.length > 1024) links = links.slice(0, 1021) + "..."
        }

        embed
          .setDescription(
            `${message.member}'s **message** in ${message.channel} was deleted.`
          )
          .addField("Message", message.content)
          .addField(
            "Attachments",
            message.attachments.size > 0
              ? links
              : "None"
          )
          .setFooter({
            text: `Some Attachments may be deleted due to Discord API limitations.`,
          });
        let image = "";
        const attachment = Array.from(message.attachments.values())[0];
        if (attachment && attachment.url) {
          const extension = attachment.url.split(".").pop();
          if (/(jpg|jpeg|png|gif)/gi.test(extension)) image = attachment.url;
        }
        embed.setImage(image);

        messageDeleteLog.send({ embeds: [embed] });
      }
    } else {
      // Dont send logs for starboard delete
      const starboardChannelId = client.db.settings.selectStarboardChannelId
        .pluck()
        .get(message.guild.id);
      const starboardChannel =
        message.guild.channels.cache.get(starboardChannelId);
      if (message.channel == starboardChannel) return;

      // Get message delete log
      const messageDeleteLogId = client.db.settings.selectMessageDeleteLogId
        .pluck()
        .get(message.guild.id);
      const messageDeleteLog =
        message.guild.channels.cache.get(messageDeleteLogId);
      if (
        messageDeleteLog &&
        messageDeleteLog.viewable &&
        messageDeleteLog
          .permissionsFor(message.guild.me)
          .has(["SEND_MESSAGES", "EMBED_LINKS"])
      ) {
        embed
          .setDescription(
            `${message.member}'s **embed** in ${message.channel} was deleted.`
          )
          .addField("Message", "`Embed`")
          .addField(
            "Attachments",
            message.attachments.size > 0
              ? message.attachments.map((a) => a.proxyURL).join("\n")
              : "None"
          )
          .setFooter({
            text: `Some Attachments may be deleted due to Discord API limitations.`,
          });
        let image = "";
        const attachment = Array.from(message.attachments.values())[0];
        if (attachment && attachment.url) {
          const extension = attachment.url.split(".").pop();
          if (/(jpg|jpeg|png|gif)/gi.test(extension)) image = attachment.url;
        }
        embed.setImage(image);

        const embed_embed = new MessageEmbed()
          .setTitle(message.embeds[0].title || "Embed")
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(message.embeds[0].description || "None")
          .setURL(message.embeds[0].url || "")
          .setColor(message.embeds[0].color || "#000000")
          .setAuthor({
            name: message.embeds[0].author ? message.embeds[0].author.name : "",
            iconURL: message.embeds[0].author ? message.embeds[0].author.iconURL : "",
          })
          .setImage(message.embeds[0].image ? message.embeds[0].image.url : "")
          .setFooter({
            text: message.embeds[0].footer ? message.embeds[0].footer.text : "",
            iconURL: message.embeds[0].footer ? message.embeds[0].footer.iconURL : "",
          })
          .setTimestamp();

        messageDeleteLog.send({ embeds: [embed, embed_embed] });
      }
    }
  },
};
