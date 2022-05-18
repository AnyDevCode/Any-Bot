const { MessageEmbed } = require('discord.js');
const schedule = require('node-schedule');
const {stripIndent} = require('common-tags');
const colors = require('colors');

/**
 * Capitalizes a string
 * @param {string} string 
 */
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Removes specifed array element
 * @param {Array} arr
 * @param {*} value
 */
function removeElement(arr, value) {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

/**
 * Trims array down to specified size
 * @param {Array} arr
 * @param {int} maxLen
 */
function trimArray(arr, maxLen = 10) {
  if (arr.length > maxLen) {
    const len = arr.length - maxLen;
    arr = arr.slice(0, maxLen);
    arr.push(`and **${len}** more...`);
  }
  return arr;
}

/**
 * Trims joined array to specified size
 * @param {Array} arr
 * @param {int} maxLen
 * @param {string} joinChar
 */
function trimStringFromArray(arr, maxLen = 2048, joinChar = '\n') {
  let string = arr.join(joinChar);
  const diff = maxLen - 15; // Leave room for "And ___ more..."
  if (string.length > maxLen) {
    string = string.slice(0, string.length - (string.length - diff)); 
    string = string.slice(0, string.lastIndexOf(joinChar));
    string = string + `\nAnd **${arr.length - string.split('\n').length}** more...`;
  }
  return string;
}

/**
 * Gets current array window range
 * @param {Array} arr
 * @param {int} current
 * @param {int} interval
 */
function getRange(arr, current, interval) {
  const max = (arr.length > current + interval) ? current + interval : arr.length;
  current = current + 1;
  return (arr.length === 1 || arr.length === current || interval === 1) ? `[${current}]` : `[${current} - ${max}]`;
}


/**
 * Gets the ordinal numeral of a number
 * @param {string} number
 */
function getOrdinalNumeral(number) {
  number = number.toString();
  if (number === '11' || number === '12' || number === '13') return number + 'th';
  if (number.endsWith(1)) return number + 'st';
  else if (number.endsWith(2)) return number + 'nd';
  else if (number.endsWith(3)) return number + 'rd';
  else return number + 'th';
}

/**
 * Gets the next moderation case number
 * @param {Client} client
 * @param guild
 * @param modLog
 */
async function getCaseNumber(client, guild, modLog) {
  
  const message = (await modLog.messages.fetch({ limit: 100 })).filter(m => m.member === guild.me &&
    m.embeds[0] &&
    m.embeds[0].type === 'rich' &&
    m.embeds[0].footer &&
    m.embeds[0].footer.text &&
    m.embeds[0].footer.text.startsWith('Case')
  ).first();
  
  if (message) {
    const footer = message.embeds[0].footer.text;
    const num = parseInt(footer.split('#').pop());
    if (!isNaN(num)) return num + 1;
  }

  return 1;
}

/**
 * Gets current status
 * @param {...*} args
 */
function getStatus(...args) {
  for (const arg of args) {
    if (!arg) return 'disabled';
  }
  return 'enabled';
}

/**
 * Format Url
 * @param {string} protocol
 * @param {string} hostname
 * @param {string} pathname 
 */
function formatUrl({pathname = '/', protocol = 'https:', ...props} = {}) {
  const url = new URL('https://site.example');
  url.protocol = protocol;
  url.hostname = props.hostname;
  url.pathname = pathname;
  return url;
}

/**
 * Surrounds welcome/farewell message keywords with backticks
 * @param {string} message
 */
function replaceKeywords(message) {
  if (!message) return message;
  else return message
    .replace(/\?member/g, '`?member`')
    .replace(/\?username/g, '`?username`')
    .replace(/\?tag/g, '`?tag`')
    .replace(/\?size/g, '`?size`');
}

/**
 * Surrounds crown message keywords with backticks
 * @param {string} message
 */
function replaceCrownKeywords(message) {
  if (!message) return message;
  else return message
    .replace(/\?member/g, '`?member`')
    .replace(/\?username/g, '`?username`')
    .replace(/\?tag/g, '`?tag`')
    .replace(/\?role/g, '`?role`')
    .replace(/\?points/g, '`?points`');
}

/**
 * Transfers crown from one member to another
 * @param {Client} client
 * @param {Guild} guild
 * @param crownRoleId
 */
async function transferCrown(client, guild, crownRoleId) {

  const crownRole = guild.roles.cache.get(crownRoleId);
  
  // If crown role is unable to be found
  if (!crownRole) {
    return await client.sendSystemErrorMessage(guild, 'crown update', stripIndent`
      Unable to transfer crown role, it may have been modified or deleted
    `);
  }
  
  const leaderboard = client.db.users.selectLeaderboard.all(guild.id);
  const winner = guild.members.cache.get(leaderboard[0].user_id);
  const points = client.db.users.selectPoints.pluck().get(winner.id, guild.id);
  let quit = false;

  // Remove role from losers
  await Promise.all(guild.members.cache.map(async member => { // Good alternative to handling async forEach
    if (member.roles.cache.has(crownRole.id)) {
      try {
        await member.roles.remove(crownRole);
      } catch (err) {

        quit = true;
        
        return await client.sendSystemErrorMessage(guild, 'crown update', stripIndent`
          Unable to transfer crown role, please check the role hierarchy and ensure I have the Manage Roles permission
        `, err.message);
      } 
    }
  }));

  if (quit) return;

  // Give role to winner
  try {
    await winner.roles.add(crownRole);
    // Clear points
    client.db.users.wipeAllPoints.run(guild.id);
  } catch (err) {
    return await client.sendSystemErrorMessage(guild, 'crown update', stripIndent`
      Unable to transfer crown role, please check the role hierarchy and ensure I have the Manage Roles permission
    `, err.message);
  }
  
  // Get crown channel and crown channel
  let { crownRoleID: crownChannelID, crownMessage: crownMessage } = 
    await client.mongodb.settings.selectRow(guild.id);
  const crownChannel = guild.channels.cache.get(crownChannelId);

  if (crownMessage[0].data.text){
    crownMessage = crownMessage[0].data.text;
  } else {
    crownMessage = ""
  }

  // Send crown message
  if (
    crownChannel &&
    crownChannel.viewable &&
    crownChannel.permissionsFor(guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS']) &&
    crownMessage
  ) {
    crownMessage = crownMessage
      .replace(/`?\?member`?/g, winner) // Member mention substitution
      .replace(/`?\?username`?/g, winner.user.username) // Username substitution
      .replace(/`?\?tag`?/g, winner.user.tag) // Tag substitution
      .replace(/`?\?role`?/g, crownRole) // Role substitution
      .replace(/`?\?points`?/g, points); // Points substitution
    crownChannel.send(new MessageEmbed().setDescription(crownMessage).setColor(guild.me.displayHexColor));
  }

  client.logger.info(`${guild.name}: Assigned crown role to ${winner.user.tag} and reset server points`);
}

/**
 * Schedule crown role rotation if checks pass
 * @param {Client} client 
 * @param {Guild} guild
 */
async function scheduleCrown(client, guild) {

  const { crownRoleID: crownRoleId, crownSchedule: cron } = await client.mongodb.settings.selectRow(guild.id);

  if (crownRoleId && cron) {
    guild.job = schedule.scheduleJob(cron, () => {
      client.utils.transferCrown(client, guild, crownRoleId);
    });
    client.logger.info(`${guild.name}: Successfully scheduled job`);
  }
}

/**
 * HTML to String
 * @param {string} html
 */
function htmlToString(html) {
  return html.replace(new RegExp("&#39;", "g"), "'").replace(new RegExp("&quot;", "g"), '"').replace(new RegExp("&amp;", "g"), '&').replace(new RegExp("<br>", "g"), "\n").replace(new RegExp("<b>", "g"), "**").replace(new RegExp("</b>", "g"), "**").replace(new RegExp("<i>", "g"), "*").replace(new RegExp("</i>", "g"), "*")
}

/**
 * String to URL Encoded
 * @param {string} str
  */
function stringToUrlEncoded(str) {

  return encodeURIComponent(str);
  

}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

async function play_song (guild, song, queue) {
  const ytdl = require('ytdl-core');

  const song_queue = queue.get(guild.id);

  if (song) console.log(colors.green(`[${guild.name}] `) + colors.yellow(`${song.title}`) + colors.green(` is now playing`));

  //If no song is left in the server queue. Leave the voice channel and delete the key and value pair from the global queue.
  if (!song) {
    song_queue.text_channel.send('🎶 | **Queue is now empty**');
    song_queue.voice_channel.leave();
    queue.delete(guild.id);
    return;
  }
  if (song.type === 'attachment') {
    song_queue.text_channel.send(`🎶 | **Now playing:** ${song.title}`);
    song_queue.connection.play(song.url, { seek: 0, volume: song_queue.volume })
      .on('finish', () => {
        if (song_queue.loop_queue) {
          song_queue.songs.push(song);
          song_queue.songs.shift();
          play_song(guild, song_queue.songs[0], queue);
        } else {
          song_queue.songs.shift();
          play_song(guild, song_queue.songs[0], queue);
        }
      })
      } else {
  const stream = ytdl(song.url, { filter: 'audioonly' });
  song_queue.connection.play(stream, { seek: 0, volume: song_queue.volume })
  .on('finish', () => {
    if (song_queue.loop_queue) {
      song_queue.songs.push(song);
      song_queue.songs.shift();
      play_song(guild, song_queue.songs[0], queue);
    } else {
      song_queue.songs.shift();
      play_song(guild, song_queue.songs[0], queue);
    }
  })

  await song_queue.text_channel.send(`🎶 Now playing **${song.title}**`)
}}

async function skip_song (message, server_queue)  {
  if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
  if(!server_queue){
      return message.channel.send(`There are no songs in queue 😔`);
  }
  server_queue.connection.dispatcher.end();
  return message.channel.send(`⏭️Skipped **${server_queue.songs[0].title}**`);
}

async function stop_song(member, server_queue) {

  let channel = server_queue.text_channel;

  server_queue.songs = [];
  server_queue.connection.dispatcher.end();
  server_queue = null;
  return channel.send(`:x: Stopped the music`);
}

async function update_server_queue(message, server_queue, queue) {
  const song_queue = queue.get(message.guild.id);
  if (!song_queue) return;
  server_queue.text_channel = message.channel;
  server_queue.voice_channel = message.member.voice.channel;
  server_queue.connection = await message.member.voice.channel.join();
  server_queue.volume = song_queue.volume;
  server_queue.loop_queue = song_queue.loop_queue;
  server_queue.songs = song_queue.songs;
  return server_queue;
}

async function force_stop_song(message, server_queue) {


  const song_queue_2 = server_queue

  let queue = message.client.queue();

  server_queue.songs = [];

  let wait_message = await message.channel.send(`🎶 |  Please wait while I configure me to play music for you.`);
  //Start the dispatcher
  server_queue.connection.play("https://cdn.discordapp.com/attachments/779357531532689438/938449326475182150/El_video_mas_corto_del_mundo_0_segundos____The_shortest_video_in_the_world_.mp4", {volume: server_queue.volume})
      .on('finish', () => {
        wait_message.delete();
        song_queue_2.voice_channel.leave();
        queue.delete(message.guild.id);

      })

}

function seconds_to_time(second) {

  //If seconds is a string, convert it to a number
  if (typeof second === 'string') second = parseInt(second);
  //If seconds is a float, convert it to a number
  if (typeof second === 'float') second = parseInt(second);
//If seconds is less than 0, return 0
  if (second < 0) return 0;


  //Get the hours, minutes and seconds
  const hours = Math.floor(second / 3600);
  const minutes = Math.floor((second - (hours * 3600)) / 60);
  const seconds = second - (hours * 3600) - (minutes * 60);

  //Return as a string
  return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

module.exports = {
  capitalize,
  removeElement,
  trimArray,
  trimStringFromArray,
  getRange,
  getOrdinalNumeral,
  getCaseNumber,
  getStatus,
  replaceKeywords,
  replaceCrownKeywords,
  transferCrown,
  scheduleCrown,
  formatUrl,
  htmlToString,
  stringToUrlEncoded,
  getRandomInt,
  play_song,
  skip_song,
  stop_song,
  update_server_queue,
  force_stop_song,
  seconds_to_time
};