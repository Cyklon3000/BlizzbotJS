import { Collection, TextChannel } from "discord.js";
import { loadCommands, loadCompletions } from "./utils/loaders.js";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { EOL } from "os";
import { join } from "path";
import { ensureFile } from "./utils/ensureFile.js";
import { ensureDirectory } from "./utils/ensureDirectory.js";
import ptero from "./ptero.js";
import logger from "./logger.js";
import MCUser from "./DBModels/MCUser.js";
import { client } from "../blizzbot.js";
import config from "./config.js";

/**
 * @typedef WhitelistEntry
 * @property {string} uuid
 * @property {string} name
 */
/**
 * @property {Collection<string, Command>} slashCommands
 * @property {Collection<string, ContextCommand>} contextCommands
 * @property {Collection<string, ButtonAction>} buttons
 * @property {Collection<string, AutoCompletion>} autocompletions
 * @property {Record<import("discord.js").Snowflake, {ts: number, link: RegExpMatchArray}>}
 * @property {string[]} blacklist
 * @property {string[]} welcomeTexts
 * @property {import("discord.js").TextChannel} _logChannel
 */
class Ctx {
    slashCommands = new Collection;
    contextCommands = new Collection;
    buttons = new Collection;
    autocompletions = new Collection;
    linkUsage = {};
    blacklist = ensureFile("configs/badwords.txt") && readFileSync("configs/badwords.txt", "utf-8").split(EOL).filter((word) => word !== "");
    welcomeTexts = ensureFile("configs/welcome.txt") && readFileSync("configs/welcome.txt", "utf-8").split(EOL).filter((word) => word !== "");
    _logChannel = null;
    _anfrageChannel = null;

    /**
     *
     * @returns {Promise<null|TextChannel>}
     */
    async getLogChannel() {
        if (this._logChannel) return this._logChannel;
        const channel = await client.channels.fetch(config.discord.channels.log);
        if (!channel) return null;
        if (!(channel instanceof TextChannel)) return null;
        this._logChannel = channel;
        return channel;
    }

    /**
     *
     * @returns {Promise<null|TextChannel>}
     */
    async getAnfrageChannel() {
        if (this._anfrageChannel) return this._anfrageChannel;
        const channel = await client.channels.fetch(config.discord.channels.anfrage);
        if (!channel) return null;
        if (!(channel instanceof TextChannel)) return null;
        this._anfrageChannel = channel;
        return channel;
    }

    async loadCommands() {
        await Promise.all(
            [
                loadCommands("commands/user", this.slashCommands),
                loadCommands("commands/moderation", this.slashCommands),
                loadCommands("commands/dev", this.slashCommands),
                loadCompletions(this.autocompletions),
            ],
        );
    }

    async syncWhitelist() {
        const mcusers = await MCUser.findAll();
        /** @type {WhitelistEntry[]} */
        const twitch = [];
        /** @type {WhitelistEntry[]} */
        const youtube = [];
        mcusers.forEach((mcUser) => {
            if (mcUser.whitelistTwitch) {
                twitch.push({
                    uuid: mcUser.mcId,
                    name: mcUser.mcName,
                });
            }
            if (mcUser.whitelistYouTube) {
                youtube.push({
                    uuid: mcUser.mcId,
                    name: mcUser.mcName,
                });
            }
        });
        const ytlist = JSON.stringify(youtube, undefined, 2);
        const twlist = JSON.stringify(twitch, undefined, 2);

        // create whitelistfolder and txt files
        if (!existsSync("whitelist")) mkdirSync("whitelist");
        ["youtube", "twitch"].forEach((type) => {
            ensureDirectory(join("whitelist", type));
            ["paths", "pterodactyl"].forEach((txtFile) => ensureFile(`whitelist/${type}/${txtFile}.txt`));
        });
        // write whitelist files
        writeFileSync("whitelist/youtube/whitelist.json", ytlist);
        writeFileSync("whitelist/twitch/whitelist.json", twlist);
        // transfer whitelist files to the matching minecraft servers
        const ytPaths = readFileSync("whitelist/youtube/paths.txt", "utf8").split(EOL).filter((path) => path !== "").map((path) => join(path, "whitelist.json"));
        const twPaths = readFileSync("whitelist/twitch/paths.txt", "utf8").split(EOL).filter((path) => path !== "").map((path) => join(path, "whitelist.json"));
        for (const path of ytPaths) copyFileSync("whitelist/youtube/whitelist.json", path);
        for (const path of twPaths) copyFileSync("whitelist/twitch/whitelist.json", path);
        const pteroYtFile = readFileSync("whitelist/youtube/pterodactyl.txt", "utf8").split(EOL).filter((path) => path !== "");
        const pteroTwFile = readFileSync("whitelist/twitch/pterodactyl.txt", "utf8").split(EOL).filter((path) => path !== "");
        for (const srv of pteroYtFile) {
            const [serverid, whitelistpath] = srv.split(" ");
            if (!serverid || !whitelistpath) return;
            await ptero.writeFile(serverid, whitelistpath, ytlist);
        }
        for (const srv of pteroTwFile) {
            const [serverid, whitelistpath] = srv.split(" ");
            if (!serverid || !whitelistpath) {
                logger.error(`"${srv}" is not a valid pterodactyl serverid and whitelist path`);
                return;
            }
            await ptero.writeFile(serverid, whitelistpath, twlist);
        }
    }
}

export default new Ctx();