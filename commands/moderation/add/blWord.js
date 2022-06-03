import { writeFileSync } from "fs";
import { EOL } from "os";

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").CommandInteraction<"cached">} interaction
 */
export async function addBLWord(client, interaction) {
    const word = interaction.options.getString("word", true).toLowerCase();
    client.blacklist.push(word);
    client.blacklist = client.blacklist.sort();
    writeFileSync("configs/badwords.txt", client.blacklist.join(EOL));
    await interaction.reply(`Das Wort \`${word}\` wurde der Blacklist hinzugefügt.`);
}