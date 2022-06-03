import { PassThrough } from "stream";
import logger from "./logger.js";
import MCUser from "./DBModels/MCUser.js";
import config from "./config.js";
import ctx from "./ctx.js";
import * as Console from "node:console";

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").Message<true>} message
 */
async function checkWhitelist(client, message) {
    const guild = message.guild;
    const members = await guild.members.fetch();
    const ytroles = config.discord.roles.whitelist.youtube;
    const twroles = config.discord.roles.whitelist.twitch;
    members.forEach((member) => {
        MCUser.upsert({
            discordId: member.id,
            ytWhitelisted: member.roles.cache.hasAny(...ytroles),
            twWhitelisted: member.roles.cache.hasAny(...twroles),
        }, {});
    });
}

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

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").Message<true>} message
 * @param  {string[]} args
 * @returns {import("discord.js").User}
 */
function getUser(client, message, args) {
    let user;
    if (message.mentions.users.size > 0) user = message.mentions.users.first();
    if (!user && args && args.length > 0) {
        let name = args.join(" ");
        user = client.users.cache.find(u => u.username === name);
        if (!user) {
            name = name.toLowerCase();
            user = client.users.cache.find(u => u.username.toLowerCase() === name);
            if (!user) user = client.users.cache.get(name);
        }
    }
    return user;
}

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
 * @param  {import("discord.js").Client<true>} client
 * @param  {string} username
 */
async function verify(client, username) {
    if (!ctx.welcomeTexts || ctx.welcomeTexts.length === 0) return logger.silly("There are no welcome messages.");
    const msg = ctx.welcomeTexts[Math.floor(Math.random() * ctx.welcomeTexts.length)].replace(/Name/g, `**${username}**`);
    await ctx.standardChannel.send({ content: msg });
}


export { checkWhitelist, permissions, getUser, createTable, verify };
