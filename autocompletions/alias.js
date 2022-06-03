import { AutoCompletion } from "../modules/command.js";

class Alias extends AutoCompletion {
    /**
     *
     * @param {import("discord.js").AutocompleteInteraction<"cached">} interaction
     */
    async complete(interaction) {
        const input = interaction.options.getFocused();
        if (typeof input === "number") return;
        await interaction.respond(
            (await Alias.findAll())
                .map((alias) => alias.name)
                .filter((alias) => alias.toLowerCase().startsWith(input.toLowerCase()))
                .map(
                    (alias) => ({ name: alias, value: alias }),
                ),
        );
    }
}

export default new Alias();