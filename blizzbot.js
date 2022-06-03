import { copyFileSync, existsSync, writeFileSync } from "fs";
import repl from "repl";
import * as db from "./modules/db.js";
import logger from "./modules/logger.js";
import config from "./modules/config.js";
import { Client, Intents } from "discord.js";
import { loadEvents } from "./modules/utils/loaders.js";
import ctx from "./modules/ctx.js";

logger.silly("ensuring the existence of a badwords.txt file");
if (!existsSync("configs/badwords.txt")) writeFileSync("configs/badwords.txt", "", { encoding: "utf-8" });

logger.silly("ensuring the existence of a welcome.txt file");
if (!existsSync("configs/welcome.txt")) copyFileSync("configs/welcome.default.txt", "configs/welcome.txt");

export const client = new Client({
    intents: [
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    partials: [
        "MESSAGE",
        "CHANNEL",
        "GUILD_MEMBER",
        "USER",
    ],
});
loadEvents(client, "events").then(() => {
    logger.info("Loaded events.");
});
await client.login(config.discord.token);
logger.info("Discord Client logging in.");

const r = repl.start("> ");

async function stop() {
    logger.info("Shutting down, please wait.");
    const stopping = [];
    client.destroy();
    stopping.push(db.db.close());
    await Promise.all(stopping);
    logger.info("Goodbye");
    logger.close();
    process.exit(0);
}

process.on("SIGINT", async () => {
    await stop();
});
r.context.client = client;
r.context.db = db;
r.context.logger = logger;
r.context.stop = stop;
r.on("close", async () => {
    await stop();
});
r.defineCommand("stop", {
    action: stop,
    help: "Stop the bot",
});
export const context = r.context;
ctx.loadCommands().then();