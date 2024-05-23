import axios from 'axios';
import { CommandTypes, CommandOptions, CommandsErrorTypes, VoiceData } from '../../utils/utils';
import { AttachmentBuilder, EmbedBuilder } from 'discord.js';

let command: CommandOptions = {
    name: "aivoice",
    type: CommandTypes.AI,
    examples: ["aivoice bingo-heeler Hello", "aivoice peter-griffin Hello everybody"],
    usage: "aivoice [ia voice] [text]",
    premiumCooldown: 30,
    premiumOnly: true,
    async run(message, args, client, language) {
        const duck_api_key = client.apiKeys.get("UBERDUCKAPI_KEY") || "";
        const duck_api_secret = client.apiKeys.get("UBERDUCKAPI_SECRET") || "";

        let uuid: string, voice_mp3:string

        let [voice] = args;
        voice = voice.toLowerCase()
        let text = args.slice(1).join(" ");

        // If voice is not defined, return error
        if (voice.length < 1) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.InvalidArgument, "The voice is not defined.")


        // Check if the voice is in the voices.txt file:
        const voices_raw: VoiceData[] = await axios
            .get("https://api.uberduck.ai/voices?mode=tts-all")
            .then(res => res.data);
        let voices: string[] = [];
        for (let i = 0; i < voices_raw.length; i++) {
            //If the voice is not private and dont have memberships
            if (!voices_raw[i].is_private && !voices.includes(voice)) voices.push(voices_raw[i].name)
        }

        if (!voices.includes(voice)) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.InvalidArgument, "That voice is not supported");

        // Check if the text has a length of 1000 characters:
        if (text.length > 1000) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.InvalidArgument, "Text is too long");


        // Check if the text is empty:
        if (text.length < 1) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.InvalidArgument, "Text is empty");


        let time_wait = 20;

        // Make the time wait increase every 5 letters in the text
        for (let i = 0; i < text.length; i++) {
            if (i % 5 === 0) time_wait += 2;
        }

        let embed = new EmbedBuilder()
            .setTitle("🎤  Voice By IA  🎤")
            .setDescription(
                `Approximately <t:${Math.round(((time_wait * 1000) + Date.now()) / 1000)}:R>, ia will make a voice for you.`
            )
            .setFields({
                name: "Voice",
                value: `${voice}`
            }, {
                name: "Text",
                value: `${text}`
            })
            .setColor(message.guild?.members?.me?.displayHexColor || message.member?.displayHexColor || "Random")
            .setTimestamp()
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL(),
            });

        let wait_message = await message.reply({ embeds: [embed] });

        time_wait = time_wait * 1000;

        await axios({
            method: "post",
            url: "https://api.uberduck.ai/speak",
            // Username and password to authenticate our request
            auth: {
                username: duck_api_key,
                password: duck_api_secret,
            },
            data: {
                speech: text,
                voice: voice,
            },
        })
            .then(async (response) => {
                uuid = response.data.uuid;
                if (!uuid) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.CommandFailure, "There was an error generating the voice, please try again later.");
            })
            .catch(async function (error) {
                if(wait_message.deletable) await wait_message.delete()
                // If the error is a status code 400, the voice is not supported
                if (error.response.status === 400) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.CommandFailure, "The voice you requested is not supported.");
                else return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.CommandFailure, "There was an error generating the voice, please try again later.");
            });

        // Wait 5 seconds for the audio to be generated

        await new Promise((resolve) => setTimeout(resolve, time_wait));

        let attemps = 0;

        async function charge_mp3() {
            await axios({
                method: "get",
                url: "https://api.uberduck.ai/speak-status?uuid=" + uuid,
                // Username and password to authenticate our request
                auth: {
                    username: duck_api_key,
                    password: duck_api_secret,
                },
            })
                .then(async function charge(response) {
                    try {
                        voice_mp3 = response.data.path;
                        if (!voice_mp3) {
                            if (attemps < 5) {
                                await new Promise((resolve) => setTimeout(resolve, 3000));
                                attemps++;
                                await charge_mp3();
                            } else return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.CommandFailure, "There was an error generating the voice, please try again later.");
                        } else {
                            // Make a Discord attachment
                            const attachment = new AttachmentBuilder(voice_mp3);
                            // Send the attachment
                            await message.reply({ files: [attachment] });
                            //Delete the message
                            wait_message.delete();
                        }
                    } catch (error) {
                        attemps++;
                        if (attemps <= 10) {
                            await charge_mp3();
                        } else return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.CommandFailure, "There was an error generating the voice, please try again later.");
                    }
                })
                .catch(async function () {
                    await embed.setDescription(
                        `An error occured, retrying in 10 seconds. ${attemps} / 3`
                    );
                    await wait_message.edit({ embeds: [embed] });
                    await charge_mp3();
                    if (attemps >= 3) {
                        wait_message.delete();
                        return message.reply({
                            content: `${message.author.username}, there was an error, please try again later.`,
                        });
                    }
                });
        }

        await charge_mp3();
    }
}

export = command;