import { SlashCommandBuilder } from "@discordjs/builders";
import { permissions } from "../../modules/utils.js";
import CustomCommand from "../../modules/DBModels/CustomCommand.js";
import splitMessage from "../../modules/utils/splitMessage.js";
import { Command } from "../../modules/command.js";

class Cmd extends Command {
    perm = permissions.mod;

    /**
     * @param  {import("discord.js").CommandInteraction<"cached">} interaction
     */
    async execute(interaction) {
        const cmds = await CustomCommand.findAll();
        const commandNames = cmds.map((cmd) => `!${cmd.commandName}`);
        const msg = `Es existieren folgende Befehle: ${commandNames.join(", ")}`;
        for (const content of splitMessage(msg, { char: ", " })) {
            await interaction.reply({ content });
        }
    }

    register() {
        return new SlashCommandBuilder()
            .setDMPermission(false)
            .setDefaultMemberPermissions(false)
            .setName("cmd")
            .setDescription("Shows the existing Customcommands")
            .setDescriptionLocalization("de", "Zeigt die alle Customcommands an").toJSON();
    }
}

export default new Cmd();