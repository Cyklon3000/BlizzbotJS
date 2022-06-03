import logger from "../modules/logger.js";

export const disabled = false;
export const name = "error";
export async function handle(client, m) {
    logger.error(m);
}