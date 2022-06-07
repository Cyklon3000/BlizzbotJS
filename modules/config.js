import { copyFileSync, existsSync, readFileSync } from "fs";
import logger from "./logger.js";

/**
 * @property {string} token
 * @property {import("discord.js").Snowflake} slashGuild
 * @property {import("discord.js").Snowflake} verificationMessage
 * @property {import("discord.js").Snowflake[]} channels.adminCommands
 * @property {import("discord.js").Snowflake} channels.anfrage
 * @property {import("discord.js").Snowflake} channels.clips
 * @property {import("discord.js").Snowflake[]} channels.commands
 * @property {import("discord.js").Snowflake[]} channels.modCommands
 * @property {import("discord.js").Snowflake[]} channels.ignore
 * @property {import("discord.js").Snowflake} channels.log
 * @property {import("discord.js").Snowflake} channels.standard
 * @property {import("discord.js").Snowflake} channels.textVoiceCategory
 * @property {import("discord.js").Snowflake} channels.verification
 * @property {import("discord.js").Snowflake} channels.voiceCategory
 * @property {import("discord.js").Snowflake} roles.dev
 * @property {import("discord.js").Snowflake} roles.mod
 * @property {import("discord.js").Snowflake} roles.noLinkFilter
 * @property {import("discord.js").Snowflake} roles.noBlacklist
 * @property {import("discord.js").Snowflake} roles.verified
 * @property {import("discord.js").Snowflake} roles.whitelist.twitch
 * @property {import("discord.js").Snowflake} roles.whitelist.youtube
 * @property {import("discord.js").Snowflake} emojis.left
 * @property {import("discord.js").Snowflake} emojis.right
 * @property {import("discord.js").Snowflake} emojis.randomReaction
 */
export class DiscordConfig {
    constructor(rawConfig) {
        this.token = rawConfig.token;
        this.slashGuild = rawConfig.slashGuild;
        this.verificationMessage = rawConfig.verificationMessage;
        this.channels = {
            adminCommands: rawConfig.channels.adminCommands,
            anfrage: rawConfig.channels.anfrage,
            clips: rawConfig.channels.clips,
            commands: rawConfig.channels.commands,
            modCommands: rawConfig.channels.modCommands,
            ignore: rawConfig.channels.ignore,
            log: rawConfig.channels.log,
            standard: rawConfig.channels.standard,
            textVoiceCategory: rawConfig.channels.textVoiceCategory,
            verification: rawConfig.channels.verification,
            voiceCategory: rawConfig.channels.voiceCategory,
        };
        this.roles = {
            dev: rawConfig.roles.dev,
            mod: rawConfig.roles.mod,
            noLinkFilter: rawConfig.roles.noLinkFilter,
            noBlacklist: rawConfig.noBlacklist,
            verified: rawConfig.roles.verified,
            whitelist: {
                youtube: rawConfig.roles.whitelist.youtube,
                twitch: rawConfig.roles.whitelist.twitch,
            },
        };
        this.emojis = {
            left: rawConfig.emojis.left,
            right: rawConfig.emojis.right,
            randomReaction: rawConfig.emojis.randomReaction,
        };
    }
}

/**
 * @property {string} host
 * @property {string} user
 * @property {string} password
 * @property {string} database
 * @property {number} port
 */
export class DBConfig {
    constructor(rawConfig) {
        this.host = rawConfig.host;
        this.port = rawConfig.port;
        this.user = rawConfig.user;
        this.database = rawConfig.database;
        this.password = rawConfig.password;
    }
}

/**
 * @property {string} host
 * @property {string} apiKey
 */
export class PterodactylConfig {
    constructor(rawConfig) {
        this.host = rawConfig.host;
        this.apiKey = rawConfig.apiKey;
    }
}
export class Config {
    constructor(rawConfig) {
        if (!rawConfig.discord) throw new Error("No discord config supplied");
        if (!rawConfig.database) throw new Error("No database config supplied");
        if (!rawConfig.pterodactyl) throw new Error("No pterodactyl config supplied");
        this.discord = new DiscordConfig(rawConfig.discord);
        this.database = new DBConfig(rawConfig.database);
        this.pterodactyl = new PterodactylConfig(rawConfig.pterodactyl);
    }
}
if (!existsSync("configs/config.json")) {
    logger.error("There is no configuration file.");
    copyFileSync("configs/example-config.json", "configs/config.json");
    logger.info("Created a configuration file - please fill.");
    process.exit(1);
}
const configJson = JSON.parse(readFileSync("configs/config.json", "utf8"));

export default new Config(configJson);
