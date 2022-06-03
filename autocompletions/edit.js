import CustomCommand from "../modules/DBModels/CustomCommand.js";

/**
 *
 * @param {import("discord.js").AutocompleteInteraction<"cached">} interaction
 * @returns {Promise<void>}
 */
export async function complete(interaction) {
    const input = interaction.options.getFocused();
    if (typeof input == "number") return;
    await interaction.respond(
        (await CustomCommand.findAll())
            .map((ccmd) => ccmd.commandName)
            .filter((ccmd) => ccmd.toLowerCase().startsWith(input.toLowerCase()))
            .map(
                (ccmd) => ({ name: ccmd, value: ccmd }),
            ),
    );
}