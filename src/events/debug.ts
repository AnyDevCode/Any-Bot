import { Events } from "discord.js";
import { Bot } from "../client";
import Colors from "colors";

export = {
    name: Events.Debug,
    run: async (info: string, client: Bot) => {
        if (!info) return;
        if (
            info.includes("[VOICE]") ||
            info.includes("[VOICE_STATE_UPDATE]") ||
            info.includes("[VOICE_SERVER_UPDATE]") ||
            info.includes("VOICE") ||
            info.includes("Sending a heartbeat.") ||
            info.includes("Unknown interaction component type received:")
        )
            return;
        if (info.includes("Heartbeat acknowledged, latency of")) {
            let latency = parseInt(info
                .split("Heartbeat acknowledged, latency of ")[1]
                .split("ms")[0])
            if (latency < 1000 && latency > 500) return client.logger.debug(`[PING] ${Colors.green(latency.toString())}ms`);
            if (latency >= 1000 && latency < 5000) return client.logger.debug(`[PING] ${Colors.yellow(latency.toString())}ms`);
            if (latency >= 5000) return client.logger.debug(`[PING] ${Colors.red(latency.toString())}ms`);

            return;
        }
        client.logger.debug(info);
    }
}