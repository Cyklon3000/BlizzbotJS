import logger from "../modules/logger.js";

export const disabled = false;
export const name = "warn";
export async function handle(client, m) {
    logger.warn(m);
}