import { VoiceChannel } from "discord.js";
import logger from "../modules/logger.js";
import config from "../modules/config.js";

const disabled = false;
const name = "voiceStateUpdate";
const disableTextVoice = true;

async function createVC(voiceChannels) {
    const existingNums = voiceChannels.map((channel) => parseInt(channel.name.replace("Channel ", "")));
    let num = 1;
    while (existingNums.includes(num)) num++;
    const vc = voiceChannels.first();
    await vc.clone({
        name: `Channel ${num}`,
        position: num,
    });
    logger.silly("Creating new Voice channel as all old ones are used up.");
}

/**
 *
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").Collection<import("discord.js").Snowflake, VoiceChannel>} emptyVCs
 * @returns {Promise<void>}
 */
async function deleteExtraVC(client, emptyVCs) {
    const vc = emptyVCs.last();
    const vcId = parseInt(vc.name.replace("Channel ", ""));
    const textVoice = vc.guild.channels.cache.find((c) => config.discord.channels.textVoiceCategory === c.parentId && c.name === `text-voice-${vcId}`);
    await vc.delete();
    await textVoice?.delete();
    emptyVCs.delete(vc.id);
    logger.silly("Deleting extra empty voice channels");
}

async function textVoiceCheck(oldMember, newMember, client) {
    if (oldMember.channel) {
        if (oldMember.channel.name.startsWith("Channel ")) {
            const vc = oldMember.channel.name;
            const vcId = parseInt(vc.replace("Channel ", ""));
            const textVoice = oldMember.guild.channels.cache.find((c) => c.name === `text-voice-${vcId}`);
            if (!textVoice) {
                logger.warn(`There is a missing Text voice channel for Channel ${vcId}`);
                return;
            }
            if (textVoice.type !== "GUILD_TEXT") return;
            textVoice.permissionOverwrites.delete(oldMember.member);
        }
    }

    if (newMember.channel) {
        if (newMember.channel.name.startsWith("Channel ")) {
            const vc = newMember.channel.name;
            const vcId = parseInt(vc.replace("Channel ", ""));
            let textVoice = newMember.guild.channels.cache.find((c) => c.name === `text-voice-${vcId}`);
            if (!textVoice) {
                textVoice = await createTextVoice(client, newMember, vcId);
            }
            if (textVoice.type !== "GUILD_TEXT") return;
            await textVoice.permissionOverwrites.create(newMember.member, {
                VIEW_CHANNEL: true,
            });
        }
    }
}

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").VoiceState} oldMember
 * @param  {import("discord.js").VoiceState} newMember
 */
async function handle(client, oldMember, newMember) {
    /** @type {import("discord.js").Collection<import("discord.js").Snowflake, VoiceChannel>} voiceChannels */
    const voiceChannels = newMember.guild.channels.cache.filter((c) => {
        // only voice channels
        if (!(c instanceof VoiceChannel)) return false;
        // only channels with a name starting with "Channel "
        if (!c.name.startsWith("Channel ")) return false;
        // only channels that are in a Voice Channel Category
        return !(!c.parent || !config.discord.channels.voiceCategory === c.parentId);
    });
    /** @type {import("discord.js").Collection<import("discord.js").Snowflake, VoiceChannel>} voiceChannels */
    const emptyVCs = voiceChannels.filter((c) => c.members.size === 0);
    if (emptyVCs.size === 0) await createVC(voiceChannels);
    while (emptyVCs.size > 1) {
        await deleteExtraVC(client, emptyVCs);
    }
    if (emptyVCs.size > 0) {
        const lastVC = emptyVCs.first();
        lastVC.guild.channels.cache.find(
            (c) => config.discord.channels.textVoiceCategory === c.parentId && c.name === `text-voice-${lastVC.name.replace("Channel ", "")}`,
        )?.delete();
    }
    const streamChannels = newMember.guild.channels.cache.filter((c) => {
        // only voice channels
        if (!(c instanceof VoiceChannel)) return false;
        // only channels with the name "Channel"
        if (c.name !== "Stream-Channel") return false;
        // only channels that are in a Voice Channel Category
        if (!c.parent || !config.discord.channels.voiceCategory.includes(c.parentId)) return false;
        // we only care about empty channels
        return c.members.size <= 0;
    });
    if (streamChannels.size > 0) streamChannels.forEach((c) => c.delete());
    // Disable Text Voice Channels due to native Implementation by Discord
    if (disableTextVoice) return;
    await textVoiceCheck(oldMember, newMember, client);
}

export {
    handle,
    name,
    disabled,
};

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").VoiceState} member
 * @param  {number} num
 */
async function createTextVoice(client, member, num) {
    const vc = member.channel;
    const permissionOverwrites = [
        {
            type: "role",
            id: vc.guild.id,
            deny: "VIEW_CHANNEL",
        },
        {
            type: "role",
            id: config.discord.roles.mod,
            allow: "VIEW_CHANNEL",
        },
    ];
    vc.members.forEach((mem) => {
        permissionOverwrites.push({
            type: "member",
            id: mem.id,
            allow: "VIEW_CHANNEL",
        });
    });
    return await vc.guild.channels.create(`text-voice-${num}`, {
        type: "GUILD_TEXT",
        parent: config.discord.channels.textVoiceCategory,
        permissionOverwrites,
    });
}