import { verify } from "../modules/utils.js";
import config from "../modules/config.js";

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").MessageReaction} reaction
 * @param  {import("discord.js").User} user
 */
export async function handle(client, reaction, user) {
    if (reaction.message.channelId !== config.discord.channels.verify) return;
    const guild = reaction.message.guild;
    let member = guild.members.resolve(user);
    if (!member) member = await guild.members.fetch(user.id);
    await member.roles.add(config.discord.roles.verify);
    await verify(client, user.username);
}
export const disabled = false;
export const name = "messageReactionAdd";