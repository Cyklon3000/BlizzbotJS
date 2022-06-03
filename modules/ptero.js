import logger from "./logger.js";
import config from "./config.js";
import { ClientServer, PteroClient } from "@devnote-dev/pterojs";

/**
 *
 * @property {PteroClient} ptero
 */
class Ptero {
    /**
     *
     * @param {import("./config.js").PterodactylConfig} pteroConfig
     */
    constructor(pteroConfig) {
        // @ts-ignore
        this.ptero = new PteroClient(pteroConfig.host, pteroConfig.apiKey, { servers: { fetch: true, cache: true } });
        this.ptero.connect().then(() => {
            logger.info("Pterodactyl connected");
        }).catch(err => {
            logger.error("Pterodactyl connection failed", err);
        });
    }

    /**
     * @param {string} srvid
     * @param {string} filepath
     * @param {string} content
     */
    async writeFile(srvid, filepath, content) {
        const srv = await this.ptero.servers.fetch(srvid);
        if (!(srv instanceof ClientServer)) {
            logger.warn(`Server ${srvid} is not a client server.`);
            return;
        }
        logger.silly("writing file to pterodactyl server");
        await srv.files.write(filepath, content);
        logger.silly("wrote file to pterodactyl server.");
    }
}

export default new Ptero(config.pterodactyl);