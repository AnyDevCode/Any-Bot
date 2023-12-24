import { Events, ActivityType, ActivitiesOptions, Guild } from "discord.js";
import { Bot } from "src/client";

export = {
    name: "ready",
    once: true,
    run: async (client: Bot) => {
        const activities: ActivitiesOptions[] = [
        {
            name: "for you",
            type: ActivityType.Listening
        },
        ];

        client.user?.setPresence({
            activities: [
                activities[0]
            ],
            status: "online"
        })

        let activity = 1;

        setInterval(() => {
            activities[1] = {
                name: `${client.prefix}help`,
                type: ActivityType.Listening
            }
            activities[2] = {
                name: `${client.guilds.cache.size} servers`,
                type: ActivityType.Watching
            }; // Update server count
            activities[3] = {
                name: `with ${client.commands.size} commands`,
                type: ActivityType.Playing
            }; // Update command count


            client.user?.setPresence({
                activities: [
                    activities[activity]
                ],
                status: "online"
            })
            activity = ++activity % activities.length;
        }, 30000)

        //For every server check the users
        for await (const guild of client.guilds.cache) {
            let members = await guild[1].members.fetch()
            client.usersCount += members.size;
            client.logger.info(`Loaded ${members.size} members from ${guild[1].name}`);
            if(!await client.database.settings.selectRow(guild[1].id)){
                client.logger.warn(`No data found for ${guild[1].name}`); //If no data found, create it.
                await client.database.settings.insertRow(guild[1].id, guild[1].name, guild[1].systemChannelId || "", "", "", "", "", "", "", "", "", "")
                client.logger.info(`Data inserted for ${guild[1].name}`);
            }
        }

        client.logger.info(`Logged in as ${client.user?.tag}!`);
        client.logger.info(
            `Ready to serve ${client.usersCount} users in ${client.guilds.cache.size} servers.`
        );
    }
}
