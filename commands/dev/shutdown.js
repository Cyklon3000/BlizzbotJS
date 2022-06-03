import { SlashCommandBuilder } from "@discordjs/builders";
import { context } from "../../blizzbot.js";
import { permissions } from "../../modules/utils.js";

const perm = permissions.dev;

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").CommandInteraction<"cached">} interaction
 */
async function run(client, interaction) {
    await interaction.reply(interaction.locale === "de" ? "Der Bot fährt herunter." : "Shutting down...");
    context.stop();
}

const setup = new SlashCommandBuilder()
    .setDefaultPermission(false)
    .setName("shutdown")
    .setDescription("stop the bot")
    .setDescriptionLocalization("de", "Fährt den Bot runter").toJSON();

export { perm, run, setup };