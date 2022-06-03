/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").GuildMember} member
 */
export async function handle(client, member) {
    await member.send({
        content: `Willkommen auf Blizzor's Community Server.
        Damit du auf dem Server freigeschalten wirst, musst du den Befehl !zz verwenden.
        Bitte gib diesen Befehl im Channel #freischalten ein.`,
    });
}
export const disabled = false;
export const name = "guildMemberAdd";
