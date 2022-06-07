import { writeFileSync } from "fs";
import { EOL } from "os";
import ctx from "../../../modules/ctx.js";

/**
 * @param  {import("discord.js").CommandInteraction<"cached">} interaction
 */
export async function deleteBLWord(interaction) {
    const word = interaction.options.getString("word", true).toLowerCase();
    if (!ctx.blacklist.includes(word)) return interaction.reply("Dieses Wort ist nicht in der Blacklist enthalten.");
    ctx.blacklist = ctx.blacklist.filter((blWord) => blWord !== word);
    writeFileSync("configs/badwords.txt", ctx.blacklist.join(EOL));
    await interaction.reply(`Das Wort \`${word}\` wurde von der Blacklist entfernt.`);
}