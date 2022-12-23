import { Events, ActivityType, ActivitiesOptions } from "discord.js";
import { Bot } from "src/client";

export = {
    name: "ready",
    once: true,
    run: (client: Bot) => {
        const activities: ActivitiesOptions[] = [{
            name: `>help`,
            type: ActivityType.Listening
        },
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

        client.logger.info(`Logged in as ${client.user?.tag}!`);
        client.logger.info(
            `Ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`
        );
    }
}
