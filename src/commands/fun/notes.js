const Command = require('../Command.js');
const { oneLine, stripIndent } = require('common-tags');
const MeowDB = require("meowdb");
const { MessageEmbed } = require('discord.js');
const notes = new MeowDB({
  dir: __dirname,
  name: "notes"
});

module.exports = class NotesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'notes',
      usage: 'notes [add/remove/edit/all] <message>',
      description: oneLine`
      You can add and edit custom notes to your liking or when you need to write something down quickly.
      `,
      type: client.types.FUN,
      examples: ['notes add Buy Nitro', 'notes edit 253 Buy Premiun', 'notes all', 'notes delete 167'],
    });
  }
  run(message, args) {
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    if (args[0] === "add") {
      if (!args[1]) return this.sendErrorMessage(message, 0, "Please enter a message to add.");
      if (notes.exists(message.author.id)) {
        const arr = notes.get(message.author.id);
        arr.push(
          args
            .slice(1)
            .join(" ")
            .replace(/(\r\n|\n|\r)/gm, " ")
        );
        notes.set(message.author.id, arr);
        {
          let embed = new MessageEmbed()
            .setTitle("Notes:")
            .setDescription(`You have successfully added a note.`)
            .setColor(message.guild.me.displayHexColor)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
          return message.channel.send(embed);
        }
      } else {
        notes.create(message.author.id, [args.slice(1).join(" ")]);
        {
          let embed = new MessageEmbed()
            .setTitle("Notes:")
            .setDescription(`You have successfully added a note.`)
            .setColor(message.guild.me.displayHexColor)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
          return message.channel.send(embed);
        }
      }
    } else if (args[0] === "delete") {
      if (notes.exists(message.author.id)) {
        if (!args[1]) {
          return this.sendErrorMessage(message, 0, "Please enter a note id to delete.");
        }
        if (args[1] === "all") {
          notes.delete(message.author.id);
          let embed = new MessageEmbed()
            .setTitle("Notes:")
            .setDescription(`You have successfully deleted all notes.`)
            .setColor(message.guild.me.displayHexColor)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
          return message.channel.send(embed);
        } else {
          const arr = notes.get(message.author.id);
          let o = parseInt(args[1]);
          if (!o) return this.sendErrorMessage(message, 0, "Please enter a id.");
          let i = o - 1;
          if (!arr[i]) return this.sendErrorMessage(message, 0, "Please enter a valid id.");
          arr.splice(i, 1);
          notes.set(message.author.id, arr);
          {
            let embed = new MessageEmbed()
              .setTitle("Notes:")
              .setDescription(`You have successfully deleted a note.`)
              .setColor(message.guild.me.displayHexColor)
              .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
              .setTimestamp();
            return message.channel.send(embed);
          }
        }
      } else return this.sendErrorMessage(message, 1, "You don't have any notes.");
    } else if (args[0] === "edit") {
      if (notes.exists(message.author.id)) {
        if (!args[1]) return this.sendErrorMessage(message, 0, "Please enter a note id to edit.");
        else {
          const arr = notes.get(message.author.id);
          let o = parseInt(args[1]);
          if (!o) return this.sendErrorMessage(message, 0, "Please enter a id.");
          let i = o - 1;
          if (!arr[i]) return this.sendErrorMessage(message, 0, "Please enter a valid id.");
          if (!args[2]) return this.sendErrorMessage(message, 0, "Please enter a message to edit.");
          arr[i] = args
            .slice(2)
            .join(" ")
            .replace(/(\r\n|\n|\r)/gm, " ");
          notes.set(message.author.id, arr);
          {
            let embed = new MessageEmbed()
              .setTitle("Notes:")
              .setDescription(`You have successfully edited a note.`)
              .setColor(message.guild.me.displayHexColor)
              .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
              .setTimestamp();
            return message.channel.send(embed);
          }
        }
      } else return this.sendErrorMessage(message, 1, "You don't have any notes.");
    } else {
            if (args[0] === "all") {

      if (notes.exists(message.author.id)) {
        const arr = notes.get(message.author.id);
        if (!arr[0]) return this.sendErrorMessage(message, 1, "You don't have any notes.");
        let text = "";
        let i = 0;
        arr.forEach(r => {
          i++;
          text += i + ". " + r + "\n";
        });
        const embed = new MessageEmbed()
        .setTitle("Notes of: " + message.author.username)
            .setDescription(`**${text}**`)
            .setColor(message.guild.me.displayHexColor)
            .setTimestamp();
      message.channel.send(embed)
      }

      } else return message.channel.send(
          `**How to use the notes: \`${prefix}notes add\`, \`${prefix}notes all\`, \`${prefix}notes edit [ID] [Message]\`, \`${prefix}notes delete [all/ID]\` ** `);
    }
  }
};
