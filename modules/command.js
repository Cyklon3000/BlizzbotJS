import { permissions } from "./utils.js";
/**
 * @abstract
 * @property {permissions} perm
 */
export class Command {
    perm = permissions.user;
    register() {
        throw new Error("Not implemented");
    }

    /**
     *
     * @param {import("discord.js").CommandInteraction<"cached">} interaction
     */
    // eslint-disable-next-line no-unused-vars
    execute(interaction) {
        throw new Error("Not implemented");
    }
}
export class ContextCommand {
    /**
     *
     * @param {import("discord.js").ContextMenuInteraction<"cached">} interaction
     */
    // eslint-disable-next-line no-unused-vars
    execute(interaction) {
        throw new Error("Not implemented");
    }
}
export class AutoCompletion {
    /**
     *
     * @param {import("discord.js").AutocompleteInteraction<"cached">} interaction
     * @returns {Promise<void>}
     */
    // eslint-disable-next-line no-unused-vars
    complete(interaction) {
        throw new Error("Not implemented");
    }
}
export class ButtonAction {
    /**
     *
     * @param {import("discord.js").ButtonInteraction<"cached">} interaction
     */
    // eslint-disable-next-line no-unused-vars
    execute(interaction) {
        throw new Error("Not implemented");
    }
}