import logger from "../modules/logger.js";
import { inspect } from "util";
import { permissions } from "../modules/utils.js";
import config from "../modules/config.js";
import ctx from "../modules/ctx.js";

export const name = "ready";
export const disabled = false;
let warnedNoVerificationChannel = false;
export async function handle(client) {
    logger.info("The bot just started.");
    const verificationChannel = await ctx.getVerificationChannel();
    if (!verificationChannel) {
        if (!warnedNoVerificationChannel) {
            logger.warn("No verification channel was found. This is not a problem, but it may cause problems later.");
            warnedNoVerificationChannel = true;
        }
        return;
    }
    await verificationChannel.messages.fetch(config.discord.verificationMessage);
    const logChannel = await ctx.getLogChannel();
    if (!logChannel || !logChannel.isText()) {
        logger.warn("The log channel supplied in the config file is not a text channel.");
        return;
    }
    const anfrageChannel = await ctx.getAnfrageChannel();
    if (!anfrageChannel || !anfrageChannel.isText()) {
        logger.warn("The 'Anfrage' channel supplied in the config file is not a text channel.");
        return;
    }
    const standardChannel = await ctx.getStandardChannel();
    if (!standardChannel || !standardChannel.isText()) {
        logger.warn("The 'standard' channel supplied in the config file is not a text channel.");
        return;
    }
    const slashGuild = await client.guilds.fetch(config.discord.slashGuild).catch(() => {
        logger.warn("received an error while trying to fetch the slashGuild.");
    });
    if (!slashGuild) return;
    const slashSetup = ctx.slashCommands.map((cmd, cmdName) => {
        logger.silly(`Parsing Command ${cmdName}`);
        logger.silly(`Command setup is ${inspect(cmd.register())}`);
        return cmd.register();
    });
    ctx.contextCommands.forEach((cmd) => slashSetup.push(cmd.register()));
    const slashCommands = await slashGuild.commands.set(slashSetup);
    const fullPermissions = [];
    slashCommands.filter((cmd) => ctx.slashCommands.get(cmd.name).perm === permissions.mod).forEach((cmd, id) => {
        /** @type {import("discord.js").GuildApplicationCommandPermissionData} */
        const perm = {
            id,
            permissions: [{
                id: config.discord.roles.mod,
                permission: true,
                type: "ROLE",
            }],
        };
        fullPermissions.push(perm);
    });
    logger.silly(`slash perms are ${inspect(fullPermissions)}`);
    await slashGuild.commands.permissions.set({
        fullPermissions,
    });
}