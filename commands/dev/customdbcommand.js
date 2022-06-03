import { SlashCommandBuilder } from "@discordjs/builders";
import { inspect } from "util";
import { db } from "../../modules/db.js";
import { permissions } from "../../modules/utils.js";
import splitMessage from "../../modules/utils/splitMessage.js";

const perm = permissions.dev;

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").CommandInteraction<"cached">} interaction
 */
async function run(client, interaction) {
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

const setup = new SlashCommandBuilder()
    .setDefaultPermission(false)
    .setName("customdbcommand")
    .addStringOption((option) => option
        .setDescription("the query")
        .setName("sql")
        .setRequired(true)
        .setDescriptionLocalization("de", "Die Abfrage"),
    )
    .setDescriptionLocalization("de", "Führe einen Befehl in der Datenbank aus")
    .setDescription("execute a database command").toJSON();

export { perm, run, setup };