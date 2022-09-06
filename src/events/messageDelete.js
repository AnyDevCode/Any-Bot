const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  name: "messageDelete",
  async execute(message, commands, client) {
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

    const { apiUrl } = client;

    if (message.embeds.length === 0) {
      // Dont send logs for starboard delete
      const starboardChannelId =
        client.mongodb.settings.selectStarboardChannelId(message.guild.id);
      const starboardChannel =
        message.guild.channels.cache.get(starboardChannelId);
      if (message.channel === starboardChannel) return;

      // Get message delete log
      const messageDeleteLogId =
        await client.mongodb.settings.selectMessageDeleteLogId(
          message.guild.id
        );
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

        let links = "";

        if (message.attachments.size > 0) {
          for (const attachment of message.attachments.values()) {
            await axios
              .post(
                `${apiUrl}/upload?url=${attachment.proxyURL}&name=${attachment.name}&id=${attachment.id}`,
                undefined,
                {
                  headers: {
                    API_KEY: client.apiKeys.customAPIKey,
                  },
                }
              )
              .then(async (res) => {
                links += `${res.data.url} \n`;
              })
              .catch(async () => {
                links += `${attachment.proxyURL} \n`;
              });
          }
          if (links.length > 1024) {
            links = links.slice(0, 1021) + "...";
            //Remove all lines with ... at the end
            links = links.replace(/\n.*\.\.\./g, "");
          }
        }

        embed
          .setDescription(
            `${message.member}'s **message** in ${message.channel} was deleted.`
          )
          .addField("Message", message.content)
          .addField(
            "Attachments",
            message.attachments.size > 0 ? links : "None"
          )
          .setFooter({
            text: `Some Attachments may be deleted due to Discord API limitations.`,
          });
        let image = "";
        let embed2;
        let embed3;
        let embed4;

        let attachments = links.split("\n");
        //Delete last line if it is empty
        if (attachments[attachments.length - 1] === "") {
          attachments.pop();
        }

        for (const attachment of attachments) {
          const extension = attachment.split(".").pop();
          if (/(jpg|jpeg|png|gif)/gi.test(extension)) {
            if (image) {
              if (embed2) {
                if (embed3) {
                  if (!embed4) {
                    embed4 = new MessageEmbed();
                    embed4.setURL("https://any-bot.xyz");
                    embed4.setImage(attachment);
                  }
                } else {
                  embed3 = new MessageEmbed();
                  embed3.setURL("https://any-bot.xyz");
                  embed3.setImage(attachment);
                }
              } else {
                embed2 = new MessageEmbed();
                embed2.setURL("https://any-bot.xyz");
                embed2.setImage(attachment);

                embed.setURL("https://any-bot.xyz");
              }
            } else {
              image = attachment;
            }
          }
        }
        embed.setImage(image);

        //If only exist the primary embed, send it
        if (embed4) {
          return messageDeleteLog.send({
            embeds: [embed, embed2, embed3, embed4],
          });
        }
        if (embed3) {
          return messageDeleteLog.send({ embeds: [embed, embed2, embed3] });
        }
        if (embed2) {
          return messageDeleteLog.send({ embeds: [embed, embed2] });
        }
        return messageDeleteLog.send({ embeds: [embed] });
      }
    } else {
      // Dont send logs for starboard delete
      const starboardChannelId =
        client.mongodb.settings.selectStarboardChannelId(message.guild.id);
      const starboardChannel =
        message.guild.channels.cache.get(starboardChannelId);
      if (message.channel === starboardChannel) return;

      // Get message delete log
      const messageDeleteLogId =
        await client.mongodb.settings.selectMessageDeleteLogId(
          message.guild.id
        );
      const messageDeleteLog =
        message.guild.channels.cache.get(messageDeleteLogId);
      if (
        messageDeleteLog &&
        messageDeleteLog.viewable &&
        messageDeleteLog
          .permissionsFor(message.guild.me)
          .has(["SEND_MESSAGES", "EMBED_LINKS"])
      ) {
        let links = "";

        if (message.attachments.size > 0) {
          for (const attachment of message.attachments.values()) {
            await axios
              .post(
                `${apiUrl}/api/v1/upload?url=${attachment.proxyURL}&name=${attachment.name}&id=${attachment.id}`
              )
              .then(async (res) => {
                links += `${res.data.url} \n`;
              })
              .catch(async () => {
                links += `${attachment.proxyURL} \n`;
              });
          }
          if (links.length > 1024) {
            links = links.slice(0, 1021) + "...";
            //Remove all lines with ... at the end
            links = links.replace(/\n.*\.\.\./g, "");
          }
        }

        embed
          .setDescription(
            `${message.member}'s **embed** in ${message.channel} was deleted.`
          )
          .addField("Message", "`Embed`")
          .addField(
            "Attachments",
            message.attachments.size > 0 ? links : "None"
          )
          .setFooter({
            text: `Some Attachments may be deleted due to Discord API limitations.`,
          });
        let image = "";
        const attachments = links.split("\n");

        for (const attachment of attachments) {
          const extension = attachment.split(".").pop();
          if (/(jpg|jpeg|png|gif)/gi.test(extension)) {
            image = attachment;
          }
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
            iconURL: message.embeds[0].author
              ? message.embeds[0].author.iconURL
              : "",
          })
          .setImage(message.embeds[0].image ? message.embeds[0].image.url : "")
          .setFooter({
            text: message.embeds[0].footer ? message.embeds[0].footer.text : "",
            iconURL: message.embeds[0].footer
              ? message.embeds[0].footer.iconURL
              : "",
          })
          .setTimestamp();

        messageDeleteLog.send({ embeds: [embed, embed_embed] });
      }
    }
  },
};
