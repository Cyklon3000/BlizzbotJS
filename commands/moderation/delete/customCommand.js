import logger from "../../../modules/logger.js";
import CustomCommand from "../../../modules/DBModels/CustomCommand.js";
import Alias from "../../../modules/DBModels/Alias.js";

/**
 * @param  {import("discord.js").CommandInteraction<"cached">} interaction
 */
export async function deleteCustomCommand(interaction) {
    let name = interaction.options.getString("name", true).toLowerCase();
    if (name.startsWith("!")) name = name.replace("!", "");
    const ccmd = await CustomCommand.findOne({ where: { commandName: name } });
    logger.info(`Delete Customcommand: ${ccmd.commandName}`);
    const linkedAliases = await Alias.destroy({
        where: {
            command: name,
            type: "ccmd",
        },
    });
    await interaction.reply({
        content: interaction.locale === "de"
            ? `Der Befehl !${name} und seine ${linkedAliases} zugehörigen Aliase wurden gelöscht.`
            : `The CustomCommand !${ccmd.commandName} was deleted`,
    });
    await ccmd.destroy();
}