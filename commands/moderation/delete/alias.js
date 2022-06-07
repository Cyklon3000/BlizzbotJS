import Alias from "../../../modules/DBModels/Alias.js";

/**
 * @param  {import("discord.js").CommandInteraction<"cached">} interaction
 */
export async function deleteAlias(interaction) {
    const aliasName = interaction.options.getString("name", true);
    const alias = await Alias.findByPk(aliasName);
    await alias.destroy();
}