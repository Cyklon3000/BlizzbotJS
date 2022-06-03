import { SlashCommandBuilder } from "@discordjs/builders";
import { permissions } from "../../modules/utils.js";
import splitMessage from "../../modules/utils/splitMessage.js";
import ctx from "../../modules/ctx.js";

const perm = permissions.mod;
/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").CommandInteraction<"cached">} interaction
 */
async function run(client, interaction) {
    const blwords = ctx.blacklist;
    if (blwords.length === 0) return interaction.reply("Die Blacklist ist leer.");
    const joinedBlacklist = `\`\`\`fix\n${blwords.join("\n")}\`\`\``;
    const sendable = splitMessage(joinedBlacklist, {
        append: "```",
        char: "\n",
        prepend: "```fix\n",
    });
    let replied = false;
    for (const toSend of sendable) {
        if (!replied) {
            await interaction.reply(toSend);
            replied = true;
        } else {
            await interaction.reply(toSend);
        }
    }
}
const setup = new SlashCommandBuilder()
    .setDefaultPermission(false)
    .setName("blacklist")
    .setDescription("Shows the current blacklist")
    .setDescriptionLocalization("de", "Zeigt die Aktuelle Blacklist an")
    .toJSON();

export { perm, run, setup };
