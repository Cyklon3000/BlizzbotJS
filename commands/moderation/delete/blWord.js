import { writeFileSync } from "fs";
import { EOL } from "os";

/**
 * @param  {import("discord.js").Client<true>} client
 * @param  {import("discord.js").CommandInteraction<"cached">} interaction
 */
export async function deleteBLWord(client, interaction) {
    const word = interaction.options.getString("word", true).toLowerCase();
    if (!client.blacklist.includes(word)) return interaction.reply("Dieses Wort ist nicht in der Blacklist enthalten.");
    client.blacklist = client.blacklist.filter((blWord) => blWord !== word);
    writeFileSync("configs/badwords.txt", client.blacklist.join(EOL));
    await interaction.reply(`Das Wort \`${word}\` wurde von der Blacklist entfernt.`);
}