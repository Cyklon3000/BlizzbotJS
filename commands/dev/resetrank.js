import { SlashCommandBuilder } from "@discordjs/builders";
import { permissions } from "../../modules/utils.js";
import XPUser from "../../modules/DBModels/XPUser.js";
import { Command } from "../../modules/command.js";

class Resetrank extends Command {
    perm = permissions.dev;

    /**
     * @param  {import("discord.js").CommandInteraction<"cached">} interaction
     */
    async execute(interaction) {
        const user = interaction.options.getUser("user", true);
        const xpuser = await XPUser.findOne({ where: { discordId: user.id, guildId: interaction.guildId } });
        await xpuser.update({ experience: 0 });
        await xpuser.save();
        await interaction.reply(interaction.locale === "de" ? "Der Rang dieses Nutzers wurde zurückgesetzt." : "The user's rank has been reset.");
    }

    register() {
        return new SlashCommandBuilder()
            .setDMPermission(false)
            .setDefaultMemberPermissions(false)
            .setName("resetrank")
            .setDescription("Reset a user's rank")
            .setDescriptionLocalization("de", "Setzt den Rang des Users zurück")
            .addUserOption((option) => option
                .setName("user")
                .setNameLocalization("de", "nutzer")
                .setDescription("The user to reset the rank for")
                .setDescriptionLocalization("de", "Der Nutzer dessen Rang zurückgesetzt werden soll")
                .setRequired(true),
            );
    }
}

export default new Resetrank();