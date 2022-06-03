import { SlashCommandBuilder } from "@discordjs/builders";
import { permissions } from "../../modules/utils.js";
import ctx from "../../modules/ctx.js";

const perm = permissions.dev;

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").CommandInteraction<"cached">} interaction
 */
async function run(client, interaction) {
    await ctx.syncWhitelist();
    await interaction.reply(interaction.locale === "de" ? "Die Whitelist wurde synchronisiert." : "The whitelist has been synced.");
}

const setup = new SlashCommandBuilder()
    .setDefaultPermission(false)
    .setName("syncwhitelist")
    .setDescription("synchronizes the whitelist")
    .setDescriptionLocalization("de", "Synchronisiert die Whitelist").toJSON();

export { perm, run, setup };
