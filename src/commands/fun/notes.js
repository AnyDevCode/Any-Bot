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
      examples: ['notes add Buy Nitro']
    });
  }
  run(message, args) {
    if (args[0] === "add") {
      if (!args[1]) {
        return message.channel.send("Write any note you want to put!");
      }
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
            message.channel.send(
              "Note added successfully"
            );
        }
      } else {
        notes.create(message.author.id, [args.slice(1).join(" ")]);
        {
            message.channel.send(
              "Note added successfully"
            );
        }
      }
    } else if (args[0] === "delete") {
      if (notes.exists(message.author.id)) {
        if (!args[1]) {
            return message.channel.send(
              "Note successfully deleted"
            );
        }
        if (args[1] === "all") {
          notes.delete(message.author.id);
            message.channel.send(
              "Notes deleted successfully"
            );
        } else {
          const arr = notes.get(message.author.id);
          let o = parseInt(args[1]);
          if (!o) {
            return message.channel.send("Invalid ID");
          }
          let i = o - 1;
          if (!arr[i]) {
              return message.channel.send("Id does not exist");
          }
          arr.splice(i, 1);
          notes.set(message.author.id, arr);
          {
              message.channel.send(
                "Notes deleted successfully"
              );
          }
        }
      } else {
          return message.channel.send("You don't have any notes");
      }
    } else if (args[0] === "edit") {
      if (notes.exists(message.author.id)) {
        if (!args[1]) {
            return message.channel.send(
              "Write the id of the note to edit"
            );
        } else {
          const arr = notes.get(message.author.id);
          let o = parseInt(args[1]);
          if (!o) {
            return message.channel.send("Invalid ID");
          }
          let i = o - 1;
          if (!arr[i]) {
              return message.channel.send("Id does not exist");
          }
          if (!args[2]) {
              return message.channel.send("Write something to edit the note");
          }
          arr[i] = args
            .slice(2)
            .join(" ")
            .replace(/(\r\n|\n|\r)/gm, " ");
          notes.set(message.author.id, arr);
          {
          message.channel.send("The note was edited");
          }
        }
      } else {
          return message.channel.send(
            "You don't have any notes"
          );
      }
    } else {
            if (args[0] === "all") {

      if (notes.exists(message.author.id)) {
        const arr = notes.get(message.author.id);
        if (!arr[0]) {
            return message.channel.send(
              "First you must add a note"
            );
        }
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
          `**How to use the notes: \`${message.client.db.settings.selectPrefix.pluck().get(message.guild.id)}notes add\`, \`${message.client.db.settings.selectPrefix.pluck().get(message.guild.id)}notes all\`, \`${message.client.db.settings.selectPrefix.pluck().get(message.guild.id)}notes edit\`, \`${message.client.db.settings.selectPrefix.pluck().get(message.guild.id)}notes delete\` ** `);
    }
  } 
};