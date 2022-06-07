import { SlashCommandBuilder } from "@discordjs/builders";
import { permissions } from "../../modules/utils.js";
import CustomCommand from "../../modules/DBModels/CustomCommand.js";
import { Command } from "../../modules/command.js";
class Edit extends Command {
    perm = permissions.mod;

    /**
     * @param  {import("discord.js").CommandInteraction<"cached">} interaction
     */
    async execute(interaction) {
        const commandName = interaction.options.getString("command", true).toLowerCase();
        const response = interaction.options.getString("response", true);
        const ccmd = await CustomCommand.findOne({ where: { commandName } });
        if (!ccmd) return await interaction.reply(interaction.locale === "de" ? "Ein solcher Befehl existiert nicht." : "There is no such command.");
        await ccmd.update({ response: response });
        await interaction.reply(interaction.locale === "de" ? "Der Befehl wurde erfolgreich aktualisiert." : "The command was updated.");
    }

    register() {
        return new SlashCommandBuilder()
            .setName("edit")
            .setDMPermission(false)
            .setDefaultMemberPermissions(false)
            .setDescription("Edit a Custom Command")
            .setDescriptionLocalization("de", "Bearbeite einen Customcommand")
            .addStringOption((option) => option
                .setName("command")
                .setDescription("The command you want to edit")
                .setDescriptionLocalization("de", "Der Befehl, den du bearbeiten möchtest")
                .setAutocomplete(true)
                .setRequired(true),
            )
            .addStringOption((option) => option
                .setName("response")
                .setDescription("The response bound to the command")
                .setDescriptionLocalization("de", "Die Antwort, die dem Befehl zugewiesen ist")
                .setRequired(true),
            );
    }
}
export default new Edit();