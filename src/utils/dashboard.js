const express = require('express');
const app = express();

app.listen(3000, () => {
  console.log("Server in port 3000");
});

async function index(client){
  app.get('/api/all', (req, res) => {
    const users = {}
    client.users.cache.forEach(user => {
      users[user.id] = {
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatarURL({size: 2048, dynamic: true})
      }
    })
    const servers = {};
    client.guilds.cache.forEach(guild => {
      servers[guild.id] = {
        name: guild.name,
        icon: guild.iconURL,
        members: {
          count: guild.memberCount,
          online: guild.members.cache.filter(member => member.presence.status === 'online').size,
          idle: guild.members.cache.filter(member => member.presence.status === 'idle').size,
          dnd: guild.members.cache.filter(member => member.presence.status === 'dnd').size,
          offline: guild.members.cache.filter(member => member.presence.status === 'offline').size,
          list: guild.members.cache.map(member => member.user.tag)
        },
        channels: guild.channels.size,
        roles: guild.roles.size,
        owner: guild.owner,
        afkChannel: guild.afkChannel,
        afkTimeout: guild.afkTimeout,
        verificationLevel: guild.verificationLevel,
        defaultChannel: guild.defaultChannel,
        defaultMessageNotifications: guild.defaultMessageNotifications,
        splash: guild.splashURL,
        emojis: guild.emojis.size,
        features: guild.features,
        createdAt: guild.createdAt,
        iconURL: guild.iconURL,
        id: guild.id,
      };
    });
    const channels = {};
    client.guilds.cache.forEach(guild => {
      channels[guild.id] = []
      guild.channels.cache.forEach(channel => {
        channels[guild.id].push({
          id: channel.id,
          name: channel.name,
          type: channel.type,
          topic: channel.topic,
          position: channel.position,
          nsfw: channel.nsfw,
          parent: channel.parent,
          permissionOverwrites: channel.permissionOverwrites,
          rateLimitPerUser: channel.rateLimitPerUser,
          lastMessageID: channel.lastMessageID,
          lastPinTimestamp: channel.lastPinTimestamp,
          lastPinID: channel.lastPinID,
          createdAt: channel.createdAt,
          lastPinnedMessageID: channel.lastPinnedMessageID,
          lastPinnedMessage: channel.lastPinnedMessage,
        });
      });
    });
    const data = {
      users: {
        count: client.users.cache.size,
        list: users
      },
      guilds: {
        count: client.guilds.cache.size,
        list: servers
      },
      channels: {
        count: client.channels.cache.size,
        types:{
          text: client.channels.cache.filter(c => c.type === 'text').size,
          voice: client.channels.cache.filter(c => c.type === 'voice').size,
          categories: client.channels.cache.filter(c => c.type === 'category').size,
          dms: client.channels.cache.filter(c => c.type === 'dm').size,
          news: client.channels.cache.filter(c => c.type === 'news').size,
          store: client.channels.cache.filter(c => c.type === 'store').size,
          unknown: client.channels.cache.filter(c => c.type === 'unknown').size
        },
        list: channels
      },
      commands: client.commands.size,
      uptime: client.uptime,
      ping: client.ws.ping,
      memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
      cpu: Math.round(process.cpuUsage().system / 1024 / 1024) + '%',
      version: client.version,
      node: process.version,
      discord: client.username,
      shards: client.shard,
    }

    res.status(200).json(data);
  });
}

module.exports = {
  index
}