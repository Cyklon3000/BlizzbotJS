import { SlashCommandBuilder } from "@discordjs/builders";
import { db } from "../../modules/db.js";
import { createTable, permissions } from "../../modules/utils.js";
import { TextChannel } from "discord.js";
import splitMessage from "../../modules/utils/splitMessage.js";

const perm = permissions.dev;

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").CommandInteraction<"cached">} interaction
 */
async function run(client, interaction) {
    let tableData;
    let table;
    const tableName = interaction.options.getString("table", true);
    if (tableName === "ranking") {
        [tableData] = await db.query("SELECT * FROM \"ranking\" ORDER BY experience DESC;");
        table = createTable(tableData.map((elem) => {
            return {
                "Name": elem.username,
                "Active": elem.available ? "yes" : "no",
                "Experience": elem.experience,
                "Discord ID": elem.discordId,
                "Discord Server ID": elem.guildId,
            };
        }));
    } else if (tableName === "mcnames") {
        [tableData] = await db.query("SELECT * FROM \"mcnames\";");
        table = createTable(tableData.map((elem) => {
            return {
                "Minecraft Name": elem.mcName,
                "Minecraft UUID": elem.mcId,
                "Discord ID": elem.discordId,
                "Whitelist YouTube": elem.whitelistYouTube ? "yes" : "no",
                "Whitelist Twitch": elem.whitelistTwitch ? "yes" : "no",
            };
        }));
    } else if (tableName === "CustomCommands") {
        [tableData] = await db.query("SELECT * FROM \"CustomCommands\";");
        table = createTable(tableData.map((elem) => {
            return {
                name: elem.commandName,
                response: elem.response,
                "last editor": elem.lastEditedBy,
                "last edit time": elem.updatedAt.toLocaleString("de-DE"),
                "deleted": elem.deletedAt === null ? "no" : "yes",
            };
        }));
    } else if (tableName === "Aliases") {
        [tableData] = await db.query("SELECT * FROM \"Aliases\";");
        table = createTable(tableData.filter((elem) => elem.deletedAt === null).map((elem) => {
            return {
                "command": elem.command,
                "alias": elem.name,
                "command type": elem.type,
            };
        }));
    } else {
        table = "Table not found";
    }
    table = `${tableName}\n\`\`\`fix\n${table}\`\`\``;
    const splitTable = splitMessage(table, {
        append: "```",
        prepend: "```fix\n",
        char: "\n",
    });
    let replied = false;
    const channel = interaction.channel;
    if (!(channel instanceof TextChannel)) {
        await interaction.reply("This command can only be used in a text channel.");
        return;
    }
    for (const toSend of splitTable) {
        if (!replied) {
            replied = true;
            await interaction.reply(toSend);
        } else {
            await channel.send(toSend);
        }
    }
}

const setup = new SlashCommandBuilder()
    .setName("checkdb")
    .addStringOption((option) => option
        .addChoices(
            ...[
                "ranking",
                "mcnames",
                "CustomCommands",
                "Aliases",
            ].map(
                (elem) => (
                    {
                        name: elem,
                        value: elem,
                    }
                ),
            ),
        )
        .setName("table")
        .setDescriptionLocalization("de", "Die anzuzeigende Tabelle")
        .setDescription("The database table to show")
        .setRequired(true),
    )
    .setDescription("shows an overview over the database")
    .setDescriptionLocalization("de", "zeigt eine übersicht der Daten in der Datenbank").toJSON();

export { perm, run, setup };