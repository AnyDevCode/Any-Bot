import { CommandTypes, CommandOptions } from '../../utils/utils';
import { AttachmentBuilder } from 'discord.js';

let command: CommandOptions = {
    name: "geometrydashsay",
    type: CommandTypes.Fun,
    aliases: ['gdsay', 'geometrydsay'],
    usage: "geometrydash [text]",
    cooldown: 30,
    premiumCooldown: 15,
    disabled: true,
    async run(message, args, client, language) {
        const lang = client.language.get(language || "en")?.get("geometrydashsay") || client.language.get("en")?.get("geometrydashsay");

        let char = ["gatekeeper", "gatekeeper.dark", "keymaster", "keymaster.huh", "keymaster.scared", "keymaster.scream", "monster", "monster.eyes", "potbor", "potbor.annoyed", "potbor.huh", "potbor.mad", "potbor.right", "potbor.talk", "potbor.tired", "scratch", "scratch.annoyed", "scratch.huh", "scratch.mad", "scratch.right", "scratch.talk", "shopkeeper", "shopkeeper.annoyed", "spooky"]
        let color = ["blue", "brown", "purple", "aqua", "green", "grey", "orange", "pink", "red"]

        let capture = char[Math.floor(char.length * Math.random())];
        let colorize = color[Math.floor(color.length * Math.random())];

        let autor = encodeURIComponent(message.author.username)

        let txt = encodeURIComponent(args.join(' '))

        if (!txt) return message.channel.send(lang.errors.noArgs);

        let links = [`https://gdcolon.com/tools/gdtextbox/img/${txt}?color=${colorize}&name=${autor}&char=${capture}`]

        let image = links[0];

        let attachment = new AttachmentBuilder(image).setName("message.png");

        message.channel.send({ files: [attachment] })
    },
}

export = command;
