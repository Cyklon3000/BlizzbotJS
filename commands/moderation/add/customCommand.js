import logger from "../../../modules/logger.js";
import CustomCommand from "../../../modules/DBModels/CustomCommand.js";

/**
 * @param  {import("discord.js").CommandInteraction<"cached">} interaction
 */
export async function addCustomCommand(interaction) {
    let name = interaction.options.getString("name", true).toLowerCase();
    if (name.startsWith("!")) name = name.replace("!", "");
    const response = interaction.options.getString("response", true);
    const lastEditor = interaction.user.id;
    const ccmd = await CustomCommand.create({
        commandName: name,
        response,
        lastEditedBy: lastEditor,
    });
    logger.info(`Added Customcommand: ${ccmd.commandName}`);
    await interaction.reply({
        content: interaction.locale === "de"
            ? `Der Befehl !${ccmd.commandName} wurde hinzugefügt`
            : `The CustomCommand !${ccmd.commandName} was added`,
    });
}