import logger from "../modules/logger.js";
import { checkMessage } from "./message.js";
import config from "../modules/config.js";

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").Message} oldMessage
 * @param  {import("discord.js").Message<true>} newMessage
 */
export async function handle(client, oldMessage, newMessage) {
    logger.silly("message edit received");
    if (!newMessage) return;
    logger.silly("message exists");
    if (newMessage.partial) newMessage = await newMessage.fetch();
    logger.silly("fetched possible partial message");
    // ignore webhooks
    if (newMessage.author.discriminator === "0000") return;
    if (config.discord.channels.ignore.includes(newMessage.channelId)) return;
    checkMessage(client, newMessage);
}

export const disabled = false;
export const name = "messageUpdate";
