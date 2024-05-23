import axios from 'axios';
import { CommandTypes, CommandOptions, CommandsErrorTypes, JobDetails } from '../../utils/utils';
import { AttachmentBuilder, EmbedBuilder } from 'discord.js';
import FormData from 'form-data';
import fs from 'fs';

const voices = [
    {
        name: "aradir",
        id: "36561"
    },
    {
        name: "maau",
        id: "77250"
    }
]

let command: CommandOptions = {
    name: "aicover",
    type: CommandTypes.AI,
    examples: ["aicover aradir", "aivoice mdc <Attachment>"],
    usage: "aicover [ia voice] [attachment}",
    premiumCooldown: 120,
    premiumOnly: true,
    disabled: false,
    async run(message, args, client, language) {
        const kitsai_token = client.apiKeys.get("KITSAI_TOKEN") || "";

        let voice_mp3: string;
        let [voice] = args;
        voice = voice.toLowerCase()

        // If voice is not defined, return error
        if (voice.length < 1) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.InvalidArgument, "The voice is not defined.")


        // Check if the voice is in the voices.txt file:
        let isVoiceSupported = false;
        let VoiceID = "";

        for (let i = 0; i < voices.length; i++) {
            if (voices[i].name === voice) {
                isVoiceSupported = true;
                VoiceID = voices[i].id;
                break; // No es necesario seguir buscando si encontramos una coincidencia
            }
        }

        if (!isVoiceSupported) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.InvalidArgument, "That voice is not supported");

        //Check if have attachment and if is mp3 or wav
        if (message.attachments.size < 1) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.InvalidArgument, "You need to send an audio file.")

        //Check if first file is a mp3 or wav
        let file = message.attachments.first()!;
        if (!file.name.endsWith(".mp3") && !file.name.endsWith(".wav")) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.InvalidArgument, "You need to send an audio file in format mp3 or wav.")

        //Download the audio file in temp using fs and axios
        const pathFile = await client.utils.TempFilePathFromInternet(file.url);

        if (!pathFile) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.InvalidArgument, "The audio file could not be processed.")

        let embed = new EmbedBuilder()
            .setTitle("🎤  Cover By IA  🎤")
            .setDescription(
                `Approximately <t:${Math.round(((120 * 1000) + Date.now()) / 1000)}:R>, ia will make a voice for you.`
            )
            .setFields({
                name: "Voice",
                value: `${voice}`
            })
            .setColor(message.guild?.members?.me?.displayHexColor || message.member?.displayHexColor || "Random")
            .setTimestamp()
            .setFooter({
                text: message.author.username,
                iconURL: message.author.displayAvatarURL(),
            });

        let headersList = {
            "authorization": `Bearer ${kitsai_token}`
        }

        let formdata = new FormData();
        formdata.append("strapiMachineLearningModelId", VoiceID);
        formdata.append("voiceModelId", VoiceID);
        // formdata.append("metadata[pitch]", "0");
        // formdata.append("metadata[rms_mix_rate]", "1");
        // formdata.append("metadata[pre][NoiseGate][threshold_db]", "-15");
        // formdata.append("metadata[pre][NoiseGate][ratio]", "2");
        // formdata.append("metadata[pre][NoiseGate][attack_ms]", "5");
        // formdata.append("metadata[pre][NoiseGate][release_ms]", "100");
        // formdata.append("metadata[pre][HighPassFilter][cutoff_frequency_hz]", "100");
        // formdata.append("metadata[pre][LowPassFilter][cutoff_frequency_hz]", "18000");
        // formdata.append("metadata[pre][Compressor][threshold_db]", "-6");
        // formdata.append("metadata[pre][Compressor][ratio]", "4");
        // formdata.append("metadata[pre][Compressor][attack_ms]", "1");
        // formdata.append("metadata[pre][Compressor][release_ms]", "40");
        formdata.append("soundFile", fs.createReadStream(pathFile));

        let bodyContent = formdata;

        let reqOptions = {
            url: "https://arpeggi.io/api/kits/v1/voice-conversions",
            method: "POST",
            headers: headersList,
            data: bodyContent,
        }

        let response: JobDetails | null = (await axios.request(reqOptions))?.data;

        if (!response) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.InvalidArgument, "The audio file could not be processed.")

        const jobID = response.id;

        if (!jobID) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.InvalidArgument, "The audio file could not be processed.")

        embed.setThumbnail(response.model?.imageUrl || null);

        let wait_message = await message.reply({ embeds: [embed] });

        // Wait 10 seconds for the audio to be generated
        let attemps = 0;

        async function charge_mp3() {
            await new Promise((resolve) => setTimeout(resolve, 10 * 1000));

            await axios({
                method: 'GET',
                url: `https://arpeggi.io/api/kits/v1/voice-conversions/${jobID}`,
                headers: {
                    authorization: `Bearer ${kitsai_token}`
                }
            })
                .then(async function (response: { data: JobDetails }) {
                    try {
                        if (attemps >= 100) return;
                        if (!response.data) {
                            attemps++;
                            return charge_mp3();
                        };

                        const job = response.data;

                        if (job.id == jobID) {
                            if (job.status == 'success') {
                                if (!job.lossyOutputFileUrl) {
                                    wait_message.delete();
                                    attemps = 100;
                                    return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.CommandFailure, "There was an error generating the voice, please try again later.");
                                }
                                voice_mp3 = job.lossyOutputFileUrl;
                                // Make a Discord attachment
                                const attachment = new AttachmentBuilder(voice_mp3, {
                                    name: `${voice} - ${file.name}`
                                });
                                // Send the attachment
                                await message.reply({ files: [attachment] });
                                //Delete the message
                                wait_message.delete();
                                attemps = 100;
                                return;
                            }

                            if (job.status == 'error') {
                                wait_message.delete();
                                attemps = 100;
                                return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.CommandFailure, "There was an error generating the voice, please try again later.");
                            }

                            if (job.status == 'cancelled') {
                                wait_message.delete();
                                attemps = 100;
                                return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.CommandFailure, "There was an error generating the voice, please try again later.");
                            }

                            attemps++;
                        } else {
                            attemps++;
                            return await charge_mp3()
                        }
                    } catch (error) {
                        attemps++;
                        if (attemps <= 5) {
                            await charge_mp3();
                        } else return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.CommandFailure, "There was an error generating the voice, please try again later.");
                    }
                })
                .catch(async function () {
                    embed.setDescription(
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