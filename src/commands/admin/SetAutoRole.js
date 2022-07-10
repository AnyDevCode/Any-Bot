// Dependencies:
const {MessageEmbed} = require('discord.js');
const {success} = require('../../utils/emojis.json');
const {oneLine} = require('common-tags');
// Command Require:
const Command = require('../Command.js');

// Command Definition:
module.exports = class SetAutoRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'setautorole',
            aliases: ['setaur', 'saur'],
            usage: 'setautorole <role mention/ID>',
            description: oneLine`
        Sets the role all new members will receive upon joining your server.
        Provide no role to clear the current \`auto role\`.
      `,
            type: client.types.ADMIN,
            userPermissions: ['MANAGE_GUILD'],
            clientPermissions: ['MANAGE_ROLES'],
            examples: ['setautorole @Member']
        });
    }

    // Command Code:
    async run(message, args) {

        // Check for role:
        const autoRoleId = await message.client.mongodb.settings.selectAutoRoleId(message.guild.id);
        const oldAutoRole = message.guild.roles.cache.find(r => r.id === autoRoleId) || '`None`';

        // Send embed:
        const embed = new MessageEmbed()
            .setTitle('Settings: `System`')
            .setThumbnail(message.guild.iconURL({dynamic: true}))
            .setDescription(`The \`auto role\` was successfully updated. ${success}`)
            .setFooter({text: `${message.member.displayName}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setTimestamp()
            .setColor(message.guild.me.displayHexColor);

        // Clear if no args provided
        if (args.length === 0) {
            await message.client.mongodb.settings.updateAutoRoleId(null, message.guild.id);
            return message.channel.send({embeds: [embed.addField('Auto Role', `${oldAutoRole} ➔ \`None\``)]});
        }

        // Update role
        const autoRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
        if (!autoRole) return await this.sendErrorMessage(message, 0, 'Please mention a role or provide a valid role ID');
        await message.client.mongodb.settings.updateAutoRoleId(autoRole.id, message.guild.id);
        return message.channel.send({embeds: [embed.addField('Auto Role', `${oldAutoRole} ➔ ${autoRole}`)]});
    }
};
