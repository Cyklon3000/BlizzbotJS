import { SlashCommandBuilder } from "@discordjs/builders";
import { inspect } from "util";
import { db } from "../../modules/db.js";
import { permissions } from "../../modules/utils.js";
import splitMessage from "../../modules/utils/splitMessage.js";
import { Command } from "../../modules/command.js";


class Customdbcommand extends Command {
    perm = permissions.dev;

    /**
     * @param  {import("discord.js").CommandInteraction<"cached">} interaction
     */
    async execute(interaction) {
        const sql = interaction.options.getString("sql", true);
        let replied = false;
        const data = await db.query(sql)
            .catch(async (reason) => {
                const iChannel = interaction.channel;
                if (!("send" in iChannel)) return;
                for (const reasonPart of splitMessage(`Deine Anfrage ergab einen Fehler: ${inspect(reason)}`)) {
                    if (!replied) {
                        await interaction.reply(reasonPart);
                        replied = true;
                    } else {
                        await iChannel.send(reasonPart);
                    }
                }
            });
        if (data) {
            const [result] = data;
            for (const resultPart of splitMessage(`\`\`\`js\n${inspect(result)}\`\`\``, {
                append: "```",
                prepend: "```js\n",
                char: "\n",
            })) {
                const iChannel = interaction.channel;
                if (!("send" in iChannel)) return;
                if (!replied) {
                    await interaction.reply(resultPart);
                    replied = true;
                } else {
                    await iChannel.send(resultPart);
                }
            }
        }
    }

    register() {
        return new SlashCommandBuilder()
            .setDMPermission(false)
            .setDefaultMemberPermissions(false)
            .setName("customdbcommand")
            .setDescriptionLocalization("de", "Führe einen Befehl in der Datenbank aus")
            .setDescription("execute a database command")
            .addStringOption((option) => option
                .setDescription("the query")
                .setName("sql")
                .setRequired(true)
                .setDescriptionLocalization("de", "Die Abfrage"),
            );
    }
}

export default new Customdbcommand();