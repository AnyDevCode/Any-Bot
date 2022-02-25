const Command = require('../Command.js');
const { QueueRepeatMode } = require('discord-player');
const options = [
    {
        name: 'off',
        value: QueueRepeatMode.OFF
    },
    {
        name: 'track',
        value: QueueRepeatMode.TRACK
    },
    {
        name: 'queue',
        value: QueueRepeatMode.QUEUE
    },
    {
        name: 'autoplay',
        value: QueueRepeatMode.AUTOPLAY
    }
]
const { MessageEmbed } = require('discord.js');

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

    async run (message, args, client, player) {
        const queue = player.getQueue(message.guild.id);
        if(!queue || !queue.playing) return message.reply(`❌ | There is nothing playing.`);
        if (!args[0]) return message.reply(`🔁 | The current loop mode is ${options.find(o => o.value === queue.repeatMode).name}`);
        if(!options.find(o => o.name.toLowerCase() === args[0].toLowerCase())) {

            const embed = new MessageEmbed()
                .setTitle('Invalid Loop Mode')
                .setDescription(`Please provide a valid loop mode.\n\n**Available Loop Modes:**\n${options.map(o => `\`${o.name}\``).join('\n')}`)
                .setColor(message.guild.me.displayHexColor)
                .setFooter({
                    text: `${message.guild.name}`,
                    iconURL: message.guild.iconURL({ dynamic: true })
                })
                .setTimestamp();
            return message.reply({ embeds: [embed] });
            
        }
        const success = await queue.setRepeatMode(options.find(o => o.name.toLowerCase() === args[0].toLowerCase()).value);
        return message.reply({
            content: success ? `🔁 | The loop mode has been set to ${options.find(o => o.value === queue.repeatMode).name}` : `🔁 | Failed to set the loop mode`,
        }
        );
    }
}
