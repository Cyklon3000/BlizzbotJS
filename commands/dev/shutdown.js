import { SlashCommandBuilder } from "@discordjs/builders";
import { context } from "../../blizzbot.js";
import { permissions } from "../../modules/utils.js";
import { Command } from "../../modules/command.js";

class Shutdown extends Command {
    perm = permissions.dev;

    /**
     * @param  {import("discord.js").CommandInteraction<"cached">} interaction
     */
    async execute(interaction) {
        await interaction.reply(interaction.locale === "de" ? "Der Bot fährt herunter." : "Shutting down...");
        context.stop();
    }

    register() {
        return new SlashCommandBuilder()
            .setDMPermission(false)
            .setDefaultMemberPermissions(false)
            .setName("shutdown")
            .setDescription("stop the bot")
            .setDescriptionLocalization("de", "Fährt den Bot runter");

    }
}

export default new Shutdown();