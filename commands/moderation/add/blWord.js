import { writeFileSync } from "fs";
import { EOL } from "os";
import ctx from "../../../modules/ctx.js";

/**
 * @param  {import("discord.js").CommandInteraction<"cached">} interaction
 */
export async function addBLWord(interaction) {
    const word = interaction.options.getString("word", true).toLowerCase();
    ctx.blacklist.push(word);
    ctx.blacklist = ctx.blacklist.sort();
    writeFileSync("configs/badwords.txt", ctx.blacklist.join(EOL));
    await interaction.reply(`Das Wort \`${word}\` wurde der Blacklist hinzugefügt.`);
}