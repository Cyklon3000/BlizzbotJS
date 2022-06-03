import { existsSync, readdirSync } from "fs";
import logger from "../logger.js";

/**
 * @param  {string} path the command directory
 * @param  {import("discord.js").Collection} commandMap the map to store the loaded commands into
 */
async function loadCommands(path, commandMap) {
    if (!existsSync(path)) throw new Error(`The given command directory ${path} does not exist.`);
    const commandFiles = readdirSync(path);
    await Promise.all(commandFiles.map(async (fileName) => {
        if (!fileName.endsWith(".js")) return;
        const name = fileName.split(".")[0];
        const filePath = `./${path}/${fileName}`;
        logger.silly(`reading command file at ${filePath}`);
        const cmd = await import(`../../${filePath}`);
        if (!cmd) return logger.warn(`Command ${name} does not exist.`);
        if (cmd.disabled) return logger.warn(`Command ${name} is disabled.`);
        commandMap.set(name, cmd);
    }));
}

/**
 * @param  {import("discord.js").Collection} completionMap the map to store the completions into
 */
async function loadCompletions(completionMap) {
    const completionFiles = readdirSync("autocompletions");
    await Promise.all(completionFiles.map(async (fileName) => {
        if (!fileName.endsWith(".js")) return;
        const filePath = `autocompletions/${fileName}`;
        logger.silly(`reading completion file at ${filePath}`);
        const completion = await import(`../../${filePath}`);
        const name = fileName.split(".")[0];
        if (!completion) return logger.warn(`Completion ${name} does not exist.`);
        if (completion.disabled) return logger.warn(`Completion ${name} is disabled.`);
        completionMap.set(name, completion);
    }));
}

/**
 * @param {import("events").EventEmitter} listener
 * @param {string} directory Path to the directory to load commands from
 */
async function loadEvents(listener, directory) {
    const eventFiles = readdirSync(directory);
    await Promise.all(eventFiles.map(async (file) => {
        const filePath = `${directory}/${file}`;
        if (!file.endsWith(".js")) return logger.warn(`${filePath} is not a javascript file and does not belong in the event directory`);
        const event = await import(`../../${filePath}`);
        if (event.disabled) return logger.info(`Event ${filePath} is disabled.`);
        if (!event.handle || !event.name) return logger.error(`Event ${filePath} does not have a handle and a name property.`);
        listener.on(event.name, event.handle.bind(null, listener));
    }));
}

export { loadEvents, loadCommands, loadCompletions };