import { SlashCommandBuilder } from "@discordjs/builders";
import { DMChannel, User } from "discord.js";
import logger from "../../modules/logger.js";
import { permissions } from "../../modules/utils.js";
import ctx from "../../modules/ctx.js";
import { Command } from "../../modules/command.js";
import { client } from "../../blizzbot.js";
class Anfrage extends Command {
    perm = permissions.user;

    /**
     * @param  {import("discord.js").CommandInteraction<"cached">} interaction
     */
    async execute(interaction) {
        let user = interaction.user;
        if (!(user instanceof User)) user = await client.users.fetch(user.id);
        const dm = await user.createDM();
        if (!(dm instanceof DMChannel)) return interaction.reply("Could not create DM channel.");
        if (!dm) {
            return interaction.reply({
                ephemeral: true,
                content: "Leider konnte ich dir keine Direktnachricht senden.",
            });
        }
        await dm.send("Bitte schreiben Sie mir Ihre Anfrage in einer Nachricht:").catch(async (reason) => {
            await interaction.reply(`Beim Senden der Nachricht ist ein Fehler aufgetreten: ${reason.toString()}`);
        });
        await interaction.reply({ content: "Sie haben eine neue Direktnachricht erhalten.", ephemeral: true });
        if (!dm) return;
        const coll = dm.createMessageCollector({ max: 1, filter: (m) => m.author.id === user.id });
        coll.on("collect", async (m) => {
            await dm.send("Vielen Dank für Ihre Anfrage!");
            const anfrageChannel = await ctx.getAnfrageChannel();
            if (!anfrageChannel) {
                logger.info(`Anfrage: ${m.author.tag}: ${m.content}`);
                logger.error("Der Anfrage Kanal ist kein Textkanal.");
                return;
            }
            if (m.content) {
                await anfrageChannel.send(`${m.author.tag}: ${m.content}`);
            } else if (m.attachments) {
                const attachments = [...m.attachments.values()];
                await anfrageChannel.send({ content: m.author.tag, files: attachments });
            }
        });
    }

    register() {
        return new SlashCommandBuilder()
            .setName("anfrage")
            .setDMPermission(true)
            .setDescription("Send a request to the mods")
            .setDescriptionLocalization("de", "Sende eine Anfrage an die Moderatoren");
    }
}

export default new Anfrage();
