const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { discord_employee, discord_partner, bughunter_level_1, bughunter_level_2, hypesquad_events, house_brilliance, house_bravery, house_balance, early_supporter, verified_bot, verified_developer} = require('../../utils/emojis.json');
const { stripIndent } = require('common-tags');
const status = {
  'online': '🟢 `Online`',
  'dnd': '🔴  `Do Not Disturbe`',
  'idle': '🌙 `Idle`',
  'offline': '⚫ `Disconnected/Invisible`'
};

function formatDate (template, date) {
  var specs = 'YYYY:MM:DD:HH:mm:ss'.split(':')
  date = new Date(date || Date.now() - new Date().getTimezoneOffset() * 6e4)
  return date.toISOString().split(/[-:.TZ]/).reduce(function (template, item, i) {
    return template.split(specs[i]).join(item)
  }, template)
}
let badges1 = {
  'EARLY_SUPPORTER': early_supporter,
  'DISCORD_EMPLOYEE': discord_employee,
  'DISCORD_PARTNER': discord_partner,
  'HYPESQUAD_EVENTS': hypesquad_events,
  'HOUSE_BRAVERY': house_bravery,
  'HOUSE_BRILLIANCE': house_brilliance,
  'BUGHUNTER_LEVEL_1': bughunter_level_1,
  'BUGHUNTER_LEVEL_2': bughunter_level_2,
  'VERIFIED_DEVELOPER': verified_developer,
  'HOUSE_BALANCE': house_balance,
  'VERIFIED_BOT': verified_bot,
}
let obj = {
"HOUSE_BRAVERY" : "Bravery" , "VERIFIED_BOT" : "Verified Bot" , "VERIFIED_DEVELOPER" : "Verified Developer" , "HOUSE_BRILLIANCE" : "Brilliance" , "DISCORD_PARTNER" : "Discord Partner"
}

module.exports = class ServerInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'userinfo',
      aliases: ['ui', 'user'],
      usage: 'userinfo <Mention>',
      description: 'Fetches information about a user.',
      examples: ['userinfo @MDC'],
      type: client.types.INFO
    });
  }
  run(message, args) {

    const member = message.mentions.members.first() || message.member

    const embed = new MessageEmbed()
        .setColor(message.guild.me.displayHexColor) //La misma mierda de siempre xD defines el color en random
        .setDescription("**Information of user:**") //Defines la descripcion
        .addField("**🎫 Name**:", "**" + `${member.user.tag}` + "**")//Que envíe el tag del usuario
        .addField("**🎟 ID**:", `${member.user.id}` )//Id del usuario
        .addField("**📌 Nickname**:", `${member.nickname !== null ? `${member.nickname}` : 'Nothing'}`, true) //Si tiene o no apodo el usuario dentro del servidor
        .addField("**🛎 Date of entry:**", formatDate('MM/DD/YYYY, at HH:mm:ss', member.joinedAt))//La fecha de ingreso del usuario al servidor
        .addField("**📥 Account created on:**", formatDate('MM/DD/YYYY, at HH:mm:ss', member.user.createdAt))//Cuando fue creada la cuenta
        .addField("**🏳️ Badges:**", member.user.flags.toArray().length ? member.user.flags.toArray().map(badge => badges1[badge]).join(' ') : "Don't have badges")//Lo que hemos definido antes las badges del usuario
        .addField("**🎮  Playing**:", member.user.presence.game != null ? user.presence.game.name : "Nothing", true)//Si esta jugando a algo, que indique el juego
        .addField("**🎖 Roles:**", member.roles.cache.map(roles => `\`${roles.name}\``).join(', '))//Los roles que posee dicho usuario(Si la cantidad de roles del usuario excede el numero de caracteres que soporta un field, dará un error de sintaxis a la consola, si es así encuentren una manera de hacerlo ustedes mismos)
        .addField("**🎨 Estatus**:", "**" + status[member.user.presence.status] + "**")//Estado del usuario
        .addField("**🚀 Boosts?**:", member.premiumSince ? '**Is boosting this server**' : '**Is not boosting**')//si esta o no boosteando el servidor
        .setThumbnail (member.user.displayAvatarURL({ format: "png", dynamic: true, size: 1024 }))//y el avatar del usuario
        .setFooter(`${message.author.username}`, `${message.author.displayAvatarURL()}`)//nombre y avatar del usuario en el footer
     message.channel.send(embed)//enviamos el embed
  }
};
