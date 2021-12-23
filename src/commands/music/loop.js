const Command = require('../Command.js');

module.exports = class LoopMusicCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'loop',
            usage: 'loop <on/off>',
            aliases: ['repeat'],
            description: 'Toggles looping of the current queue.',
            examples: ['loop on', 'loop off'],
            type: client.types.MUSIC,
        });
    }

    async run (message, args){
        let queue = message.client.queue()
        let serverQueue = queue.get(message.guild.id)

        if (!serverQueue) return this.sendErrorMessage(message, 1, 'There is nothing playing.');
        if (!args[0]) {
            if (serverQueue.loop_queue) return message.channel.send('➿ Looping is currently on.');
            else return message.channel.send('➿ Looping is currently off.');
        }

        if (args[0] === 'on') {
            serverQueue.loop_queue = true;
            return message.channel.send('➿ Looping is now **on**.');
        }
        else if (args[0] === 'off') {
            serverQueue.loop_queue = false;
            return message.channel.send('➿ Looping is now **off**.');
        }
        else return this.sendErrorMessage(message, 1, 'Invalid option.');
    }
}
