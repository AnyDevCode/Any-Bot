import { Events } from "discord.js";
import { Bot } from "../client";

export = {
    name: Events.Error,
    run: async (info: string, client: Bot) => {
        if (!info) return;
        client.logger.warn(info);
    }
}