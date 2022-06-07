import { SlashCommandBuilder } from "@discordjs/builders";
import { permissions } from "../../modules/utils.js";
import ctx from "../../modules/ctx.js";
import { Command } from "../../modules/command.js";

class Syncwhitelist extends Command {
    perm = permissions.dev;

    /**
     * @param  {import("discord.js").CommandInteraction<"cached">} interaction
     */
    async execute(interaction) {
        await ctx.syncWhitelist();
        await interaction.reply(interaction.locale === "de" ? "Die Whitelist wurde synchronisiert." : "The whitelist has been synced.");
    }

    register() {
        return new SlashCommandBuilder()
            .setDMPermission(false)
            .setDefaultMemberPermissions(false)
            .setName("syncwhitelist")
            .setDescription("synchronizes the whitelist")
            .setDescriptionLocalization("de", "Synchronisiert die Whitelist");
    }
}

export default new Syncwhitelist();
