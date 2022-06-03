import logger from "../modules/logger.js";
import { verify } from "../modules/utils.js";
import XPUser from "../modules/DBModels/XPUser.js";
import CustomCommand from "../modules/DBModels/CustomCommand.js";
import Alias from "../modules/DBModels/Alias.js";
import config from "../modules/config.js";
import ctx from "../modules/ctx.js";

const linkRegex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z\d+&@#/%=~_|$?!:,.]*\)|[-A-Z0\d&@#/%=~_|$?!:,.])*(?:\([-A-Z\d@#/%=~_|$?!:,.]*\)|[A-Z\d/%=~_|$])/igm;

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").Message<true>} message
 */
async function handleCommands(client, message) {
    if (!message.content.startsWith("!")) return false;
    const args = message.content.split(/ +/g);
    const command = args.shift().toLowerCase().slice("!".length);
    const ccmd = await CustomCommand.findOne({ where: { commandName: command } });
    if (ccmd) {
        await message.reply(ccmd.response);
        return true;
    } else {
        const alias = await Alias.findOne({ where: { name: command } });
        if (!alias) return false;
        if (alias.type === "ccmd") {
            const accmd = await CustomCommand.findOne({ where: { commandName: alias.command } });
            if (accmd) {
                await message.reply(accmd.response);
                return true;
            }
        }
    }
}

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").GuildMember} member
 */
async function unverify(client, member) {
    await member.roles.remove(config.discord.roles.verify);
}

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").Message<true>} message
 * @returns {boolean}
 */
export async function checkMessage(client, message) {
    if (!message.guild) return false;
    if (message.author.id === client.user.id) return false;
    if (message.member && message.member.roles && message.member.roles.cache.map((r) => r.id).some((r) => config.discord.roles.noFilter.includes(r))) return false;
    let links = [...message.content.matchAll(linkRegex)];
    if (message.channel.id === config.discord.channels.clips) links = links.filter((l) => !l.toString().replace(/^(http|https):\/\//, "").startsWith("clips.twitch.tv"));
    if (links.length > 0) {
        if (message.deletable) await message.delete();
        let previousLinks = ctx.linkUsage[message.author.id];
        if (!previousLinks) previousLinks = [];
        previousLinks = previousLinks.filter((link) => message.createdAt.getTime() - link.ts < 5000);
        const newLinks = previousLinks;
        let shouldUnverify = false;
        links.forEach((link) => {
            if (previousLinks.some((previousLink) => previousLink.url === link)) shouldUnverify = true;
            newLinks.push({ ts: message.createdAt.getTime(), url: link });
        });
        if (shouldUnverify && message.member.roles.cache.has(config.discord.roles.verify)) await unverify(client, message.member);
        return true;
    }
    if (ctx.blacklist.length > 0) {
        const lowerMessage = message.content.toLowerCase();
        if (ctx.blacklist.some((blword) => lowerMessage.indexOf(blword) !== -1)) {
            if (message.deletable) {
                message.delete().catch((e) => logger.error(`Received an error deleting a message:
                ${e.stack}`));
            }
            const dmChannel = await message.author.createDM();
            await dmChannel.send(`Ihre Nachricht mit dem Inhalt **${message.content.slice(0, 1900)}** wurde entfernt. Melden Sie sich bei Fragen an einen Moderator.`);
            return true;
        }
    }
    return false;
}

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").Message<true>} message
 */
export async function handle(client, message) {
    logger.silly("message received");
    if (!message) return;
    logger.silly("message exists");
    if (message.partial) message = await message.fetch();
    logger.silly("fetched possible partial message");
    // ignore webhooks
    if (message.author.discriminator === "0000") return;
    if (config.discord.channels.ignore.includes(message.channelId)) return;
    if (checkMessage(client, message)) return;
    logger.silly("message was clean.");
    if (Math.random() > 0.999) await message.react(config.discord.emojis.randomReaction);
    logger.silly("checking for verification");
    if (message.channelId === config.discord.channels.verify) {
        if (message.content.toLowerCase() === `!zz`) {
            logger.silly("verifying user..");
            await message.member.roles.add(config.discord.roles.verify);
            await verify(client, message.author.username);
        }
        if (message.deletable) await message.delete();
        return;
    }
    if (config.discord.channels.commands.includes(message.channelId)) return handleCommands(client, message);

    if (!message.guild) return;
    if (message.author.bot) return;
    await calculateExperience(message);
}

/**
 *
 * @param {import("discord.js").Message<true>} message
 */
async function calculateExperience(message) {
    const [xpuser] = await XPUser.findOrCreate({
        where: {
            discordId: message.author.id,
            guildId: message.guildId,
        },
        defaults: {
            experience: 0,
            available: true,
            username: message.author.username,
        },
    });
    if (xpuser.username !== message.author.username) await xpuser.update({ username: message.author.username });
    const exp = Math.min(10, Math.floor(((message.content.length) - 2) / 5));
    await xpuser.increment("experience", {
        by: exp,
    });
}

export const disabled = false;
export const name = "messageCreate";
