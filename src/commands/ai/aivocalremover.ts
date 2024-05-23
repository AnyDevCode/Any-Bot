import axios from 'axios';
import { CommandTypes, CommandOptions, CommandsErrorTypes, JobDetails } from '../../utils/utils';
import { EmbedBuilder, Message } from 'discord.js';
import FormData from 'form-data';
import fs from 'fs';

let command: CommandOptions = {
    name: "aivocalremover",
    type: CommandTypes.AI,
    examples: ["aivocalremover <attachment>"],
    usage: "aivocalremover <attachment>",
    premiumCooldown: 120,
    premiumOnly: true,
    async run(message, args, client, language) {
        const kitsai_token = client.apiKeys.get("KITSAI_TOKEN") || "";

        //Check if have attachment and if is mp3 or wav
        if (message.attachments.size < 1) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.InvalidArgument, "You need to send an audio file.")

        //Check if first file is a mp3 or wav
        let file = message.attachments.first()!;
        if (!file.name.endsWith(".mp3") && !file.name.endsWith(".wav")) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.InvalidArgument, "You need to send an audio file in format mp3 or wav.")

        //Check if the file is less than 50MB
        if (file.size > 50 * 1024 * 1024) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.InvalidArgument, "The file is too big, the maximum size is 50MB.")

        //Download the audio file in temp using fs and axios
        const pathFile = await client.utils.TempFilePathFromInternet(file.url);

        if (!pathFile) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.InvalidArgument, "The audio file could not be processed.")

        let embed = new EmbedBuilder()
            .setTitle("🎤  Vocal Remover By IA  🎤")
            .setDescription(
                `Approximately <t:${Math.round(((120 * 1000) + Date.now()) / 1000)}:R>, ia will remove the voice from the audio.`
            )
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
        formdata.append("inputFile", fs.createReadStream(pathFile));
        formdata.append("dereverb", "false");
        formdata.append("denoise", "false");
        formdata.append("splitInstrumental", "true");


        let reqOptions = {
            url: "https://arpeggi.io/api/kits/v1/vocal-separations?type=audio",
            method: "POST",
            headers: headersList,
            data: formdata,
        }

        let response: JobDetails | null = (await axios.request(reqOptions))?.data;

        if (!response) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.InvalidArgument, "The audio file could not be processed.")

        const jobID = response.id;

        if (!jobID) return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.InvalidArgument, "The audio file could not be processed.")

        let wait_message: Message = await message.reply({ embeds: [embed] });

        // Wait 10 seconds for the audio to be generated
        let attemps = 0;



        async function charge_mp3() {
            await new Promise((resolve) => setTimeout(resolve, 10 * 1000));

            await axios({
                method: 'GET',
                url: `https://arpeggi.io/api/kits/v1/vocal-separations/${jobID}`,
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

                        if (job.status == 'success') {
                            if (!job.lossyVocalAudioFileUrl || !job.backingAudioFileUrl) {
                                wait_message.delete();
                                attemps = 100;
                                return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.CommandFailure, "There was an error generating the voice, please try again later.");
                            }

                            //Short url using https://t.mdcdev.me/ (Using YOURLS)
                            const vocalAudioFileUrl = await axios.get("https://t.mdcdev.me/yourls-api.php?signature=0ba677fc77&format=simple&action=shorturl&url=" + encodeURIComponent(job.lossyVocalAudioFileUrl)).then((res) => res.data);
                            // Wait 10 seconds for the api rate limit
                            await new Promise((resolve) => setTimeout(resolve, 30 * 1000));
                            const backingAudioFileUrl = await axios.get("https://t.mdcdev.me/yourls-api.php?signature=0ba677fc77&format=simple&action=shorturl&url=" + encodeURIComponent(job.backingAudioFileUrl)).then((res) => res.data);

                            wait_message.delete();
                            attemps = 100;

                            const successEmbed = new EmbedBuilder()
                                .setTitle("🎤  Vocal Remover By IA  🎤")
                                .setDescription(
                                    `The voice has been removed from the audio, you can download the vocals and the background music.\n\n[Voice](${vocalAudioFileUrl})\n[Background](${backingAudioFileUrl})`
                                )
                                .setColor(message.guild?.members?.me?.displayHexColor || message.member?.displayHexColor || "Random")
                                .setTimestamp()
                                .setFooter({
                                    text: message.author.username,
                                    iconURL: message.author.displayAvatarURL(),
                                });

                            return message.reply({ embeds: [successEmbed] });
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
                        return await charge_mp3()

                    } catch (error) {
                        attemps++;
                        if (attemps <= 5) {
                            await charge_mp3();
                        } else return client.utils.sendErrorEmbed(client, language, message, command, CommandsErrorTypes.CommandFailure, "There was an error generating the voice, please try again later.");
                    }
                })
                .catch(async function (e) {
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