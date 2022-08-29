const { MessageEmbed } = require("discord.js");
const schedule = require("node-schedule");
const { stripIndent } = require("common-tags");
const colors = require("colors");
const { Client } = require("genius-lyrics");
const axios = require("axios");

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
function trimStringFromArray(arr, maxLen = 2048, joinChar = "\n") {
  let string = arr.join(joinChar);
  const diff = maxLen - 15; // Leave room for "And ___ more..."
  if (string.length > maxLen) {
    string = string.slice(0, string.length - (string.length - diff));
    string = string.slice(0, string.lastIndexOf(joinChar));
    string =
      string + `\nAnd **${arr.length - string.split("\n").length}** more...`;
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
  const max = arr.length > current + interval ? current + interval : arr.length;
  current = current + 1;
  return arr.length === 1 || arr.length === current || interval === 1
    ? `[${current}]`
    : `[${current} - ${max}]`;
}

/**
 * Gets the ordinal numeral of a number
 * @param {string} number
 */
function getOrdinalNumeral(number) {
  number = number.toString();
  if (number === "11" || number === "12" || number === "13")
    return number + "th";
  if (number.endsWith(1)) return number + "st";
  else if (number.endsWith(2)) return number + "nd";
  else if (number.endsWith(3)) return number + "rd";
  else return number + "th";
}

/**
 * Gets the next moderation case number
 * @param {Client} client
 * @param guild
 * @param modLog
 */
async function getCaseNumber(client, guild, modLog) {
  const message = (await modLog.messages.fetch({ limit: 100 }))
    .filter(
      (m) =>
        m.member === guild.me &&
        m.embeds[0] &&
        m.embeds[0].type === "rich" &&
        m.embeds[0].footer &&
        m.embeds[0].footer.text &&
        m.embeds[0].footer.text.startsWith("Case")
    )
    .first();

  if (message) {
    const footer = message.embeds[0].footer.text;
    const num = parseInt(footer.split("#").pop());
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
    if (!arg) return "disabled";
  }
  return "enabled";
}

/**
 * Format Url
 * @param {string} protocol
 * @param {string} hostname
 * @param {string} pathname
 */
function formatUrl({ pathname = "/", protocol = "https:", ...props } = {}) {
  const url = new URL("https://site.example");
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
  else
    return message
      .replace(/\?member/g, "`?member`")
      .replace(/\?username/g, "`?username`")
      .replace(/\?tag/g, "`?tag`")
      .replace(/\?size/g, "`?size`");
}

/**
 * Surrounds crown message keywords with backticks
 * @param {string} message
 */
function replaceCrownKeywords(message) {
  if (!message) return message;
  else
    return message
      .replace(/\?member/g, "`?member`")
      .replace(/\?username/g, "`?username`")
      .replace(/\?tag/g, "`?tag`")
      .replace(/\?role/g, "`?role`")
      .replace(/\?points/g, "`?points`");
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
    return client.sendSystemErrorMessage(
      guild,
      "crown update",
      stripIndent`
      Unable to transfer crown role, it may have been modified or deleted
    `
    );
  }

  const leaderboard = await client.mongodb.users.selectLeaderboard(guild.id);
  const winner = guild.members.cache.get(leaderboard[0].user_id);
  const points = await client.mongodb.users.selectPoints(winner.id, guild.id);
  let quit = false;

  // Remove role from losers
  await Promise.all(
    guild.members.cache.map(async (member) => {
      // Good alternative to handling async forEach
      if (member.roles.cache.has(crownRole.id)) {
        try {
          await member.roles.remove(crownRole);
        } catch (err) {
          quit = true;

          return client.sendSystemErrorMessage(
            guild,
            "crown update",
            stripIndent`
          Unable to transfer crown role, please check the role hierarchy and ensure I have the Manage Roles permission
        `,
            err.message
          );
        }
      }
    })
  );

  if (quit) return;

  // Give role to winner
  try {
    await winner.roles.add(crownRole);
    // Clear points
    await client.mongodb.users.wipeAllPoints(guild.id);
  } catch (err) {
    return client.sendSystemErrorMessage(
      guild,
      "crown update",
      stripIndent`
      Unable to transfer crown role, please check the role hierarchy and ensure I have the Manage Roles permission
    `,
      err.message
    );
  }

  // Get crown channel and crown channel
  let { crownRoleID: crownChannelID, crownMessage: crownMessage } =
    await client.mongodb.settings.selectRow(guild.id);
  const crownChannel = guild.channels.cache.get(crownChannelID);

  if (crownMessage[0].data.text) {
    crownMessage = crownMessage[0].data.text;
  } else {
    crownMessage = "";
  }

  // Send crown message
  if (
    crownChannel &&
    crownChannel.viewable &&
    crownChannel
      .permissionsFor(guild.me)
      .has(["SEND_MESSAGES", "EMBED_LINKS"]) &&
    crownMessage
  ) {
    crownMessage = crownMessage
      .replace(/`?\?member`?/g, winner) // Member mention substitution
      .replace(/`?\?username`?/g, winner.user.username) // Username substitution
      .replace(/`?\?tag`?/g, winner.user.tag) // Tag substitution
      .replace(/`?\?role`?/g, crownRole) // Role substitution
      .replace(/`?\?points`?/g, points); // Points substitution
    crownChannel.send(
      new MessageEmbed()
        .setDescription(crownMessage)
        .setColor(guild.me.displayHexColor)
    );
  }

  client.logger.info(
    `${guild.name}: Assigned crown role to ${winner.user.tag} and reset server points`
  );
}

/**
 * Schedule crown role rotation if checks pass
 * @param {Client} client
 * @param {Guild} guild
 */
async function scheduleCrown(client, guild) {
  if(!guild.available) return;
  const { crownRoleID: crownRoleId, crownSchedule: cron } =
    await client.mongodb.settings.selectRow(guild.id);

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
  return html
    .replace(new RegExp("&#39;", "g"), "'")
    .replace(new RegExp("&quot;", "g"), '"')
    .replace(new RegExp("&amp;", "g"), "&")
    .replace(new RegExp("<br>", "g"), "\n")
    .replace(new RegExp("<b>", "g"), "**")
    .replace(new RegExp("</b>", "g"), "**")
    .replace(new RegExp("<i>", "g"), "*")
    .replace(new RegExp("</i>", "g"), "*");
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

/**
 * Get the avatar of member or user
 * @param {GuildMember} member
 * @param {Guild} guild
 * @param {Client} client
 * @param {string} [size]
 * @returns {string} the member avatar URL
 */
async function getMemberAvatar(member, guild, client, size) {
  const data = await axios
    .get(
      `https://discord.com/api/guilds/${guild.id}/members/${member.user.id}`,
      {
        headers: {
          Authorization: `Bot ${client.token}`,
        },
      }
    )
    .then((d) => d.data);

  if (data.avatar && data.avatar !== member.user.avatar) {
    let url = data.avatar.startsWith("a_")
      ? size
        ? ".gif?size=" + size
        : ".gif?size=4096"
      : size
      ? ".png?size=" + size
      : ".png?size=4096";
    url = `https://cdn.discordapp.com/guilds/${guild.id}/users/${member.user.id}/avatars/${data.avatar}${url}`;
    return url;
  } else {
    return null;
  }
}

function seconds_to_time(second) {
  //If seconds is a string, convert it to a number
  if (typeof second === "string") second = parseInt(second);
  //If seconds is a float, convert it to a number
  if (typeof second === "float") second = parseInt(second);
  //If seconds is less than 0, return 0
  if (second < 0) return 0;

  //Get the hours, minutes and seconds
  const hours = Math.floor(second / 3600);
  const minutes = Math.floor((second - hours * 3600) / 60);
  const seconds = second - hours * 3600 - minutes * 60;

  //Return as a string
  return `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }:${seconds < 10 ? "0" + seconds : seconds}`;
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
  getMemberAvatar,
  seconds_to_time,
};
