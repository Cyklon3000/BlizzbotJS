import { SlashCommandBuilder } from "@discordjs/builders";
import { permissions } from "../../modules/utils.js";
import XPUser from "../../modules/DBModels/XPUser.js";
import MCUser from "../../modules/DBModels/MCUser.js";

const perm = permissions.dev;
/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").CommandInteraction<"cached">} interaction
 */
async function run(client, interaction) {
    const user = interaction.options.getUser("name", true);
    await MCUser.destroy({ where: { discordId: user.id }, limit: 1 });
    await XPUser.destroy({ where: { discordId: user.id, guildId: interaction.guildId } });
    await interaction.reply(interaction.locale === "de" ? "Der Nutzer wurde zurückgesetzt." : "The user has been reset.");
}
const setup = new SlashCommandBuilder()
    .setDefaultPermission(false)
    .setName("resetuser")
    .setDescription("Deletes a user's data from the database")
    .setDescriptionLocalization("de", "Löscht alle Daten vom User aus der Datenbank")
    .addUserOption((option) => option
        .setDescriptionLocalization("de", "Der Nutzer dessen Daten gelöscht werden sollen")
        .setDescription("The user to reset the data for")
        .setName("user")
        .setRequired(true)
        .setNameLocalization("de", "nutzer"),
    ).toJSON();

export { perm, run, setup };
