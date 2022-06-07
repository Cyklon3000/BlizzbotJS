import { PassThrough } from "stream";
import logger from "./logger.js";
import ctx from "./ctx.js";
import * as Console from "node:console";


/**
 * @enum
 */
const permissions = {
    user: 0,
    twitchsub: 1,
    ytsub: 2,
    mod: 5,
    owner: 9,
    dev: 10,
};

const ts = new PassThrough({
    transform(chunk, enc, cb) {
        cb(null, chunk);
    },
});
const customConsole = new Console({ stdout: ts });

/**
 * @param  {any[]} list
 * @returns {string} the table as shown using `console.table`
 */
function createTable(list) {
    customConsole.table(list);
    return (ts.read() || "");
}

/**
 * @param  {string} username
 */
async function verify(username) {
    if (!ctx.welcomeTexts || ctx.welcomeTexts.length === 0) return logger.silly("There are no welcome messages.");
    const msg = ctx.welcomeTexts[Math.floor(Math.random() * ctx.welcomeTexts.length)].replace(/Name/g, `**${username}**`);
    const standardChannel = await ctx.getStandardChannel();
    await standardChannel.send({ content: msg });
}


export { permissions, createTable, verify };
