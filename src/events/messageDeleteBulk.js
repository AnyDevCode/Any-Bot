const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "messageDeleteBulk",
    async execute(messages, commands, client) {
        const message = messages.first();
  
        // Get message delete log
        const messageDeleteLogId = client.mongodb.settings.selectMessageDeleteLogId(message.guild.id);
        const messageDeleteLog = message.guild.channels.cache.get(messageDeleteLogId);
        if (
          messageDeleteLog &&
          messageDeleteLog.viewable &&
          messageDeleteLog.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
        ) {
      
          const embed = new MessageEmbed()
            .setTitle('Message Update: `Bulk Delete`')
            .setAuthor({name: `${message.guild.name}`, iconURL: message.guild.iconURL({ dynamic: true })})
            .setDescription(`**${messages.size} messages** in ${message.channel} were deleted.`)
            .setTimestamp()
            .setColor(message.guild.me.displayHexColor);
          messageDeleteLog.send({embeds: [embed]});
        }
    }
}      
