import ctx from "../modules/ctx.js";
import { AutoCompletion } from "../modules/command.js";

class Blacklist extends AutoCompletion {
    /**
     *
     * @param {import("discord.js").AutocompleteInteraction<"cached">} interaction
     * @returns {Promise<void>}
     */
    async complete(interaction) {
        const input = interaction.options.getFocused();
        if (typeof input === "number") return;
        await interaction.respond(
            (ctx.blacklist)
                .filter((blword) => blword.toLowerCase().startsWith(input.toLowerCase()))
                .map(
                    (blword) => ({ name: blword, value: blword }),
                ),
        );
    }
}

export default new Blacklist();