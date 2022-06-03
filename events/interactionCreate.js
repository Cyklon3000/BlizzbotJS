import { AutocompleteInteraction, ButtonInteraction, CommandInteraction } from "discord.js";
import logger from "../modules/logger.js";
import ctx from "../modules/ctx.js";

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").Interaction<"cached">} interaction
 */
export async function handle(client, interaction) {
    if (interaction instanceof AutocompleteInteraction) {
        await autocompleteHandler(interaction);
    } else if (interaction instanceof ButtonInteraction) {
        await buttonHandler(interaction);
    } else if (interaction instanceof CommandInteraction) {
        await commandHandler(client, interaction);
    }
}

/**
 *
 * @param {AutocompleteInteraction<"cached">} interaction
 */
async function autocompleteHandler(interaction) {
    const completer = ctx.autocompletions.get(interaction.commandName);
    if (!completer) {
        logger.error(`unknown command while trying to autocomplete: ${interaction.commandName}`);
        return;
    }
    await completer.complete(interaction);
}

/**
 *
 * @param {ButtonInteraction<"cached">} interaction
 */
async function buttonHandler(interaction) {
    const [name, ...args] = interaction.customId.split("_");
    const button = ctx.buttons.get(name);
    if (!button) {
        logger.error(`unknown button: ${name}`);
        await interaction.reply({ content: `Unknown button ${name}, please report at https://github.com/Blizzorganization/BlizzbotJS/issues if there is no such issue` });
        return;
    }
    button.execute(interaction, args);
}

/**
 *
 * @param {import("discord.js").Client<true>} client
 * @param {CommandInteraction<"cached">} interaction
 */
async function commandHandler(client, interaction) {
    const cmd = ctx.slashCommands.get(interaction.commandName);
    if (cmd) {
        await cmd.run(client, interaction);
        return;
    }
    logger.error(`Unknown Command run: ${interaction.commandName}`);
}

export const disabled = false;
export const name = "interactionCreate";