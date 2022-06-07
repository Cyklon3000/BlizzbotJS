import { SlashCommandBuilder } from "@discordjs/builders";
import { permissions } from "../../modules/utils.js";
import XPUser from "../../modules/DBModels/XPUser.js";
import MCUser from "../../modules/DBModels/MCUser.js";
import { Command } from "../../modules/command.js";

class Resetuser extends Command {
    perm = permissions.dev;

    /**
     * @param  {import("discord.js").CommandInteraction<"cached">} interaction
     */
    async execute(interaction) {
        const user = interaction.options.getUser("name", true);
        await MCUser.destroy({ where: { discordId: user.id }, limit: 1 });
        await XPUser.destroy({ where: { discordId: user.id, guildId: interaction.guildId } });
        await interaction.reply(interaction.locale === "de" ? "Der Nutzer wurde zurückgesetzt." : "The user has been reset.");
    }

    register() {
        return new SlashCommandBuilder()
            .setDMPermission(false)
            .setDefaultMemberPermissions(false)
            .setName("resetuser")
            .setDescription("Deletes a user's data from the database")
            .setDescriptionLocalization("de", "Löscht alle Daten vom User aus der Datenbank")
            .addUserOption((option) => option
                .setDescriptionLocalization("de", "Der Nutzer dessen Daten gelöscht werden sollen")
                .setDescription("The user to reset the data for")
                .setName("user")
                .setRequired(true)
                .setNameLocalization("de", "nutzer"),
            );
    }
}

export default new Resetuser();
