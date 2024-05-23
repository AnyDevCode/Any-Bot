import { CommandTypes, CommandOptions, CommandsErrorTypes } from '../../utils/utils';
import { EmbedBuilder, Attachment, ActionRowBuilder, ButtonBuilder, ButtonStyle, Embed } from 'discord.js';
import { inspect } from "util";

let command: CommandOptions = {
    name: "eval",
    usage: "eval <code>",
    ownerOnly: true,
    type: CommandTypes.Owner,
    examples: ["eval 1 + 1"],
    async run(message, args, client, language) {
        let code = args.join(" ");
        if (!code)
            return client.utils.sendErrorEmbed(client, language, message, this, CommandsErrorTypes.InvalidArgument, "Te falta codigo bro")
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("evalbtn")
                .setLabel("Delete Output")
                .setStyle(ButtonStyle.Danger)
        );
        if (!code.toLowerCase().includes("token")) {
            const originalCode = code;

            if (originalCode.includes("--str"))
                code = `${code.replace("--str", "").trim()}.toString()`;
            if (originalCode.includes("--send"))
                code = `message.reply(${code.replace("--send", "").trim()})`;
            if (originalCode.includes("--async"))
                code = `(async () => {${code.replace("--async", "").trim()}})()`;
            code = code.replace("--silent", "").trim();

            if (String(code).includes(message.client.token)) {
                message.delete();
                return message.reply(
                    "WOW, THIS IS MY FUCKING TOKEN, YOU LITTLE SHITTY BITCH\n https://media.discordapp.net/attachments/949096817650434090/965844199704522752/Any_Bot_Hold_Up.jpg?width=636&height=479"
                );
            }

            let newCode = code;

            const embed = new EmbedBuilder();

            try {
                code = await eval(code);
                if (originalCode.includes("--silent")) return;
                code = inspect(code, { depth: 0 });

                if (String(code).includes(message.client.token)) {
                    //Delete the last 5 message of the user
                    (await message.channel.messages
                        .fetch({ limit: 5 }))
                        .filter((m) => m.member?.id === message.client.user.id);

                    let embed = new EmbedBuilder()
                        .setTitle("WOW, THIS IS MY FUCKING TOKEN, YOU LITTLE SHITTY BITCH")
                        .setImage(
                            "https://media.discordapp.net/attachments/949096817650434090/965844199704522752/Any_Bot_Hold_Up.jpg?width=636&height=479"
                        )
                        .setColor("#ff0000")
                        .setFooter({
                            text: `${message.member?.displayName} i think you are a fucking idiot`,
                        })
                        .setTimestamp();

                    return message.reply({ embeds: [embed] });
                }

                embed
                    .addFields(
                        {
                            name: "Input",
                            value: `\`\`\`js\n${newCode.length > 1024 ? "Too large to display." : newCode}\`\`\``
                        },
                        {
                            name: "Output",
                            value: `\`\`\`js\n${code.length > 1024 ? "Too large to display." : code}\`\`\``
                        }
                    )
                    .setColor("#66FF00");
            } catch (err: any) {
                embed
                    .addFields(
                        {
                            name: "Input",
                            value: `\`\`\`js\n${newCode.length > 1024 ? "Too large to display." : newCode}\`\`\``
                        },
                        {
                            name: "Output",
                            value: `\`\`\`js\n${err.length > 1024 ? "Too large to display." : err}\`\`\``
                        }
                    )
                    .setColor("#FF0000");
            }

            await message.reply({ embeds: [embed], components: [row] });
        } else {
            await message.reply("(╯°□°)╯︵ ┻━┻ MY token. **MINE**.");
        }
    }
}

export = command;
