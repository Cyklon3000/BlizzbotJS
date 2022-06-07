import { SlashCommandBuilder } from "@discordjs/builders";
import { permissions } from "../../modules/utils.js";
import splitMessage from "../../modules/utils/splitMessage.js";
import ctx from "../../modules/ctx.js";
import { Command } from "../../modules/command.js";

class Blacklist extends Command {
    perm = permissions.mod;

    /**
     * @param  {import("discord.js").CommandInteraction<"cached">} interaction
     */
    async execute(interaction) {
        const blwords = ctx.blacklist;
        if (blwords.length === 0) return interaction.reply("Die Blacklist ist leer.");
        const joinedBlacklist = `\`\`\`fix\n${blwords.join("\n")}\`\`\``;
        const sendable = splitMessage(joinedBlacklist, {
            append: "```",
            char: "\n",
            prepend: "```fix\n",
        });
        let replied = false;
        for (const toSend of sendable) {
            if (!replied) {
                await interaction.reply(toSend);
                replied = true;
            } else {
                await interaction.reply(toSend);
            }
        }
    }

    register() {
        return new SlashCommandBuilder()
            .setDMPermission(false)
            .setDefaultMemberPermissions(false)
            .setName("blacklist")
            .setDescription("Shows the current blacklist")
            .setDescriptionLocalization("de", "Zeigt die Aktuelle Blacklist an");
    }
}

export default new Blacklist();
