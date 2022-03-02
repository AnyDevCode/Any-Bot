//Dependencies and const:
const {MessageEmbed, MessageAttachment} = require("discord.js");
const axios = require("axios");
// Command Require:
const Command = require("../Command.js");
const fs = require("fs");


// Command Definition:
module.exports = class aivoiceCommand extends Command {
    constructor(client) {
        super(client, {
            name: "aivoice",
            aliases: ["aiv", "ai-voice", "ai-v", "iaiv", "iai-voice", "iai-v", "iavoice"],
            usage: "iavoice [voice] [text]",
            description: "Make a ia make a voice",
            type: client.types.FUN,
            examples: ["iavoice ZIM I am invader"],
        });
    }

    // Command Code:
    async run(message, args) {
        const duck_api_key = message.client.apiKeys.uberduckapi_key;
        const duck_api_secret = message.client.apiKeys.uberduckapi_secret;

        let uuid;

        let voice_mp3;

        let voice = args.slice(0, 1).join(" ").toLowerCase();

        // If voice is not defined, return error
        if (voice.length < 1) {
            return this.sendErrorMessage(message, 0, "The voice is not defined.");
        }

        // Check if the voice is in the voices.txt file:
        if (fs.existsSync(__basedir + "/data/voices.txt")) {
            let voices = fs.readFileSync(__basedir + "/data/voices.txt", "utf8");
            if (!voices.includes(voice)) {
                return this.sendErrorMessage(message, 0, "That voice is not supported");
            }
        } else {
            return this.sendErrorMessage(message, 0, "voices.txt is missing");
        }

        // Make a voice lowercase

        let text = args.slice(1).join(" ");

        // Check if the text has a length of 1000 characters:
        if (text.length > 1000) {
            return this.sendErrorMessage(message, 0, "Text is too long");
        }

        // Check if the text is empty:
        if (text.length < 1) {
            return this.sendErrorMessage(message, 0, "Text is empty");
        }

        let time_wait = 10;

        // Make the time wait increase every 5 letters in the text
        for (let i = 0; i < text.length; i++) {
            if (i % 5 === 0) {
                time_wait += 2;
            }
        }

        let embed = new MessageEmbed()
            .setTitle("🎤  Voice By IA  🎤")
            .setDescription(
                `Approximately in ${time_wait} seconds, ia will make a voice for you.`
            )
            .addField("Voice", `${voice}`)
            .addField("Text", `${text}`)
            .setColor(message.guild.me.displayHexColor)
            .setTimestamp()
            .setFooter(
                {text: message.member.displayName, icon_url: message.author.displayAvatarURL({ dynamic: true })}
            );

        let wait_message = await message.channel.send({embeds: [embed]});

        time_wait = time_wait * 1000;

        let time_wait_loop = time_wait;

        // Every second, edit the embed to show the time left
        let interval_time = setInterval(async () => {
            if (time_wait_loop > 0) {
                embed.setDescription(
                    `Approximately in ${
                        time_wait_loop / 1000
                    } seconds, ia will make a voice for you.`
                );
                await wait_message.edit({embeds: [embed]});
                time_wait_loop -= 5000;
            }
            if (time_wait_loop <= 0) {
                await embed.setDescription(
                    `Right now your voice will be made, please wait.`
                );
                await wait_message.edit({embeds: [embed]});
                // Clear the interval
                clearInterval(interval_time);
            }
        }, 5000);

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
            .then(function (response) {
                uuid = response.data.uuid;
                if (!uuid) {
                    clearInterval(interval_time);
                    return message.channel.send(
                        {content: "There was an error generating the voice, please try again later."}
                    );
                }
            })
            .catch(async function (error) {
                await clearInterval(interval_time);
                await wait_message.delete();
                // If the error is a status code 400, the voice is not supported
                if (error.response.status === 400) {
                    return message.channel.send(
                        {content: `${message.author.username}, the voice you requested is not supported.`}
                    );
                } else {
                    return message.channel.send(
                       {content:  `${message.author.username}, there was an error, please try again later.`}
                    );
                }
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
                                await await charge_mp3();
                            } else {
                                return message.channel.send(
                                    { content: `${message.author.username}, there was an error, please try again later.`}
                                );
                            }
                        } else {
                            // Make a Discord attachment
                            const attachment = new MessageAttachment(voice_mp3);
                            // Send the attachment
                            await await message.reply({files: [attachment]});
                            //Stop the loop
                            clearInterval(interval_time);
                            //Delete the message
                            wait_message.delete();
                        }
                    } catch (error) {
                        console.log(error);
                        attemps++;
                        if (attemps <= 10) {
                            await await charge_mp3();
                        } else {
                            message.channel.send(
                                { content: `${message.author.username}, there was an error, please try again later.`}
                            );
                        }
                    }
                })
                .catch(async function () {
                    await clearInterval(interval_time);
                    await embed.setDescription(
                        `An error occured, retrying in 10 seconds. ${attemps} / 3`
                    );
                    await wait_message.edit({embeds: [embed]});
                    await await charge_mp3();
                    if (attemps >= 3) {
                        clearInterval(interval_time);
                        wait_message.delete();
                        return message.channel.send(
                            { content: `${message.author.username}, there was an error, please try again later.`}
                        );
                    }
                });
        }

        await await charge_mp3();
    }
};
