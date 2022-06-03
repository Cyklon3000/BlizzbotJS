import { SlashCommandBuilder } from "@discordjs/builders";
import { permissions } from "../../modules/utils.js";
import CustomCommand from "../../modules/DBModels/CustomCommand.js";
import splitMessage from "../../modules/utils/splitMessage.js";

const perm = permissions.mod;

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").Message<true>} message
 */
async function run(client, message) {
    const cmds = await CustomCommand.findAll();
    const commandNames = cmds.map((cmd) => `!${cmd.commandName}`);
    const msg = `Es existieren folgende Befehle: ${commandNames.join(", ")}`;
    for (const content of splitMessage(msg, { char: ", " })) {
        await message.reply({ content });
    }
}

const setup = new SlashCommandBuilder()
    .setDefaultPermission(false)
    .setName("cmd")
    .setDescription("Shows the existing Customcommands")
    .setDescriptionLocalization("de", "Zeigt die alle Customcommands an").toJSON();

export { perm, run, setup };