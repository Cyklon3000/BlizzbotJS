import Alias from "../../../modules/DBModels/Alias.js";

/**
 * @param  {import("discord.js").CommandInteraction<"cached">} interaction
 * @param  {"command"|"customcommand"} type
 */
export async function addAlias(interaction, type) {
    const alias = interaction.options.getString("name", true);
    const command = interaction.options.getString("command", true);
    await Alias.create({
        name: alias,
        command,
        type: type === "command" ? "cmd" : "ccmd",
    });
    await interaction.reply(interaction.locale === "de" ? "Der Alias wurde erfolgreich hinzugefügt" : "The Alias was added.");
}