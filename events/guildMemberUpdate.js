import MCUser from "../modules/DBModels/MCUser.js";
import config from "../modules/config.js";
import ctx from "../modules/ctx.js";

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").GuildMember} oldMember
 * @param  {import("discord.js").GuildMember} newMember
 */
export async function handle(client, oldMember, newMember) {
    const [mcuser] = await MCUser.findOrCreate({ where: { discordId: newMember.id } });
    mcuser.set({ whitelistTwitch: config.discord.roles.whitelist.twitch.some((r) => newMember.roles.cache.has(r)) });
    mcuser.set({ whitelistYouTube: config.discord.roles.whitelist.youtube.some((r) => newMember.roles.cache.has(r)) });
    await mcuser.save();
    await ctx.syncWhitelist();
}
export const disabled = false;
export const name = "guildMemberUpdate";
